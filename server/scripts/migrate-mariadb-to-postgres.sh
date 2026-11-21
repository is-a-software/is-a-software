#!/usr/bin/env bash
# One-time copy of accounts, subdomains and DNS records from the old MariaDB database into the
# new PostgreSQL one. Passwords, subscriptions and GitHub links are deliberately left behind:
# sign-in is now through Central Auth, which links each old account by its email on first sign-in.
#
# Before running:
#   1. Point the new backend at an EMPTY PostgreSQL database and start it once, so Hibernate
#      creates the tables. Stop it again (or make sure nobody uses it) while this runs.
#   2. Keep the MariaDB database as it is. This script only reads from it.
#
# Usage:
#   scripts/migrate-mariadb-to-postgres.sh "<mariadb client args>" "<postgres connection URI>"
# Example:
#   scripts/migrate-mariadb-to-postgres.sh "-h 127.0.0.1 -u root -p isasoftware" \
#       "postgresql://postgres@127.0.0.1:5432/isasoftware"
#
# Safe to retry: everything is loaded in one transaction, and it refuses to touch a target that
# already has accounts in it.
set -euo pipefail

if [[ $# -ne 2 ]]; then
  sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
  exit 2
fi
read -r -a MARIADB_ARGS <<< "$1"
PG_URI=$2

maria() { mariadb "${MARIADB_ARGS[@]}" --batch --skip-column-names --raw -e "$1"; }
pg() { psql "$PG_URI" -X -q -v ON_ERROR_STOP=1 "$@"; }

echo "Checking the PostgreSQL target..."
for table in '"user"' domain dns_record; do
  pg -tAc "SELECT 1 FROM $table LIMIT 0" >/dev/null \
    || { echo "Table $table is missing: start the new backend once against this database first." >&2; exit 1; }
done
existing=$(pg -tAc 'SELECT count(*) FROM "user"')
if [[ $existing != 0 ]]; then
  echo "The target already has $existing accounts. Refusing to copy into a non-empty database." >&2
  exit 1
fi

# Spring's default naming turned createdAt into created_at on MariaDB; accept either spelling.
user_created=$(maria "SELECT column_name FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'user' AND column_name IN ('created_at', 'createdAt') LIMIT 1")
if [[ -z $user_created ]]; then
  echo "Could not find the user table's creation date column in MariaDB." >&2
  exit 1
fi

echo "Reading from MariaDB..."
users=$(maria "SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT(
    'id', user_id, 'email', user_email, 'name', user_name, 'role', role, 'status', user_status,
    'created', \`$user_created\`)), JSON_ARRAY()) FROM \`user\`")
domains=$(maria "SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT(
    'id', id, 'user_id', \`user\`, 'subdomain', subdomain, 'created', created_at)), JSON_ARRAY()) FROM domain")
records=$(maria "SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT(
    'id', id, 'domain_id', domain, 'name', name, 'type', type, 'value', value, 'ttl', ttl,
    'cloudflare_id', cloudflare_id, 'created', created_at)), JSON_ARRAY()) FROM dns_record")

echo "Writing to PostgreSQL in one transaction..."
pg -1 -v users="$users" -v domains="$domains" -v records="$records" <<'SQL'
INSERT INTO "user" (user_id, user_email, user_name, role, user_status, "createdAt")
SELECT id, email, name, role, status, created
FROM json_to_recordset(:'users'::json)
  AS t(id int, email text, name text, role text, status text, created date);

INSERT INTO domain (id, "user", subdomain, created_at)
SELECT id, user_id, subdomain, created
FROM json_to_recordset(:'domains'::json)
  AS t(id int, user_id int, subdomain text, created date);

INSERT INTO dns_record (id, domain, name, type, value, ttl, cloudflare_id, created_at)
SELECT id, domain_id, name, type, value, COALESCE(ttl, 300), cloudflare_id, created
FROM json_to_recordset(:'records'::json)
  AS t(id int, domain_id int, name text, type text, value text, ttl bigint, cloudflare_id text, created date);

-- New rows must continue after the copied IDs.
SELECT setval(pg_get_serial_sequence('"user"', 'user_id'), COALESCE(MAX(user_id), 0) + 1, false) FROM "user";
SELECT setval(pg_get_serial_sequence('domain', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM domain;
SELECT setval(pg_get_serial_sequence('dns_record', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM dns_record;
SQL

echo "Verifying counts..."
for pair in "user:\`user\`:\"user\"" "domain:domain:domain" "dns_record:dns_record:dns_record"; do
  IFS=: read -r label maria_table pg_table <<< "$pair"
  from=$(maria "SELECT count(*) FROM $maria_table")
  to=$(pg -tAc "SELECT count(*) FROM $pg_table")
  printf '  %-11s MariaDB %6s  ->  PostgreSQL %6s\n' "$label" "$from" "$to"
  [[ $from == "$to" ]] || { echo "Count mismatch for $label." >&2; exit 1; }
done
echo "Done. Old accounts link to Central Auth automatically when they first sign in with the same email."
