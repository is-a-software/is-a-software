
domains_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../domains" && pwd)"
output_file="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/domain-status.txt"

echo "Checking subdomains with CNAME or A records..."
echo "=============================================="
echo ""

total_with_records=$(find "$domains_dir" -name "*.json" -exec grep -l '"CNAME"\|"A"' {} \; | wc -l)
echo "Total domains with CNAME/A records: $total_with_records"
echo ""

> "$output_file"

success_count=0
fail_count=0

echo "Testing domains..." > "$output_file"
echo "==================" >> "$output_file"
echo "" >> "$output_file"

for file in "$domains_dir"/*.json; do
    filename=$(basename "$file" .json)
    
    if grep -q '"CNAME"\|"A"' "$file"; then
        record_type=""
        record_value=""
        
        if grep -q '"CNAME"' "$file"; then
            record_type="CNAME"
            record_value=$(grep -o '"CNAME"[[:space:]]*:[[:space:]]*"[^"]*"' "$file" | cut -d'"' -f4)
        elif grep -q '"A"' "$file"; then
            record_type="A"
            record_value=$(grep -o '"A"[[:space:]]*:[[:space:]]*"[^"]*"' "$file" | cut -d'"' -f4)
        fi
        
        domain="https://${filename}.is-a.software"
        http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$domain" 2>/dev/null || echo "000")
        
        if [ "$http_code" = "200" ]; then
            status="✅ 200"
            ((success_count++))
        else
            status="❌ $http_code"
            ((fail_count++))
        fi
        
        echo "${filename}: ${status} | ${record_type}: ${record_value}" >> "$output_file"
    fi
done

echo "" >> "$output_file"
echo "Summary:" >> "$output_file"
echo "========" >> "$output_file"
echo "✅ Success (200): $success_count" >> "$output_file"
echo "❌ Failed: $fail_count" >> "$output_file"
echo "Total: $total_with_records" >> "$output_file"

cat "$output_file"
