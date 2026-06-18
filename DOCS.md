# Getting a free `*.is-a.software` subdomain

- [Prerequisites](#prerequisites)
- [Step-by-step](#step-by-step)
- [Supported DNS record types](#supported-dns-record-types)
- [Platform-specific examples](#platform-specific-examples)
- [Why some platforms aren't listed](#why-some-platforms-arent-listed)
- [Troubleshooting](#troubleshooting)
- [Going further](#going-further)

This guide walks you through claiming your own subdomain (e.g. `myproject.is-a.software`) and pointing it to your website.

---

## Prerequisites

- A website or project deployed somewhere (GitHub Pages, Render, Fly.io, your own server, etc.)
- A working email address (for account verification)

> **Limitation:** Platforms like **Vercel and Netlify** require domain ownership verification via TXT records at the zone apex (e.g. `_vercel.myproject.is-a.software`). Our DNS management doesn't currently support creating arbitrary verification records at the root level, so these platforms won't work. We're working on it — join our [Discord](https://discord.com/invite/AeAjegXn6D) for updates.

---

## Step-by-step

### 1. Deploy your project

Your project needs to be live on a hosting platform. If you haven't deployed yet, here are some free options:

| Platform | Free tier |
|----------|-----------|
| [Cloudflare Pages](https://pages.cloudflare.com) | Generous free tier for static sites |
| [GitHub Pages](https://pages.github.com) | Free for public repos |
| [Render](https://render.com) | Free tier for static sites and services |
| [Fly.io](https://fly.io) | Free allowance for full-stack apps |

### 2. Add your subdomain as a custom domain on your host

Go to your hosting platform's settings and add your future subdomain as a custom domain — for example, `myproject.is-a.software`.

The platform will give you a **DNS record value** to copy. This is usually one of:

- A **CNAME** target (e.g. `myproject.onrender.com`)
- One or more **A record IP addresses** (e.g. `185.199.108.153`)
- An **AAAA record IPv6 address**

**Keep this value — you'll need it in step 4.**

### 3. Create an account

1. Go to [is-a.software/signup](https://is-a.software/signup)
2. Enter your name, email, and a password (minimum 8 characters)
3. Check your email for a 6-digit OTP code
4. Enter the OTP to verify your email
5. You're logged in and automatically on the **FREE plan** (2 subdomains, 5 DNS records)

### 4. Claim your subdomain

1. Go to the [Dashboard](https://is-a.software/dashboard)
2. In the "Domains" section, enter your desired subdomain name (e.g. `myproject`)
3. Click **Create** — if the name is available, it's yours

### 5. Create a DNS record

In the dashboard, find your new subdomain and add a DNS record:

| If your host gave you… | Use record type | Example value |
|------------------------|----------------|---------------|
| A domain name like `myproject.onrender.com` | **CNAME** | `myproject.onrender.com` |
| An IP address like `185.199.108.153` | **A** | `185.199.108.153` |
| An IPv6 address like `2001:db8::1` | **AAAA** | `2001:db8::1` |

1. Click **Add Record** on your subdomain
2. Set **Name** to `@` (for the root subdomain)
3. Choose the correct **Type**
4. Paste the **Value** you copied from your host
5. Leave **TTL** at the default (300)
6. Click **Submit**

The record is created in our database and synced to Cloudflare's DNS automatically.

### 6. Wait for propagation

DNS changes can take anywhere from 30 seconds to 30 minutes to propagate worldwide. Once propagated, visiting `myproject.is-a.software` will show your website.

---

## Supported DNS record types

| Type | Purpose | Example |
|------|---------|---------|
| **A** | Point to an IPv4 address | `76.76.21.21` |
| **AAAA** | Point to an IPv6 address | `2a00:1450:4001:82b::1` |
| **CNAME** | Point to another domain name | `myproject.onrender.com` |
| **TXT** | Add text records (verification, SPF) | `google-site-verification=...` |
| **MX** | Mail exchange records (Premium only) | `mail.example.com` |
| **NS** | Name server records (Premium only) | `ns1.example.com` |

**Note:** A, AAAA, and CNAME records are **mutually exclusive** per hostname — you can't have both an A record and a CNAME for `@` on the same subdomain.

---

## Platform-specific examples

### GitHub Pages

1. In your repo → **Settings** → **Pages** → **Custom domain**
2. Enter `myproject.is-a.software`
3. GitHub Pages shows you the IP addresses to use (usually A records)
4. In the is-a.software dashboard, create **A records** for each IP

### Cloudflare Pages

1. In your project → **Custom domains** → **Set up custom domain**
2. Enter `myproject.is-a.software`
3. Cloudflare Pages may auto-provision — create a **CNAME** record pointing to `myproject.pages.dev`

### Render

1. In your service dashboard → **Settings** → **Custom Domain**
2. Enter `myproject.is-a.software`
3. Render gives you a CNAME target like `myproject.onrender.com`
4. In the is-a.software dashboard, create a **CNAME** record with that value

### Fly.io

1. In your app dashboard → **Certificates** → **Add certificate**
2. Enter `myproject.is-a.software`
3. Fly.io gives you a CNAME target — create a **CNAME** record with that value

### Any VPS with a static IP

If you have a server with a static IPv4 address, just create an **A** record pointing to that IP.

---

## Why some platforms aren't listed

Platforms like **Vercel and Netlify** require a TXT verification
record at the zone apex to prove domain ownership (e.g. `_vercel.myproject.is-a.software`
or `_netlify-fc-*`). Our DNS management doesn't yet support creating arbitrary
verification records at the root level — we only support standard apex records (`@`).

Until this is added, use platforms that work with simple A, AAAA, or CNAME records
(GitHub Pages, Render, Fly.io, any VPS with a static IP). Join our
[Discord](https://discord.com/invite/AeAjegXn6D) for updates on Vercel/Netlify support.

---

## Troubleshooting

### "Domain is taken"
The subdomain name is already claimed. Try a different name.

### "DNS record limit reached"
The FREE plan allows 5 DNS records. Options:
- [Connect GitHub](https://is-a.software/github) and star the repo for +3 bonus records
- [Upgrade to Premium](https://is-a.software/subscriptions) for 50 records
- Delete unused records from the dashboard

### "A/AAAA/CNAME record already exists"
Only one of A, AAAA, or CNAME is allowed per hostname. Delete the existing record first, or use a different name (not `@`).

### "Invalid record value"
Check the format:
- **A** records need a valid IPv4 address (e.g. `76.76.21.21`)
- **AAAA** records need a valid IPv6 address (e.g. `2001:db8::1`)
- **CNAME** records need a domain name, not an IP

### My site isn't showing after 30 minutes
1. Verify the DNS record in the dashboard is correct
2. Double-check the value matches what your hosting platform gave you
3. Try a DNS lookup tool like `dig myproject.is-a.software` or an online checker
4. Visit the Discord community for help

### Cloudflare API error
If you see a Cloudflare-related error when creating/deleting records, it's likely a temporary API issue. Try again in a few minutes.

---

## Going further

### GitHub star bonus

Connect your GitHub account on the [GitHub settings page](https://is-a.software/github) and star our repo. This adds **3 extra DNS records** to your FREE plan (8 total).

### Premium plans

| Plan | Domains | DNS Records | Price |
|------|---------|-------------|-------|
| FREE | 2 | 5 (+3 with GitHub) | Free |
| PREMIUM | 10 | 50 | ₹79/year |
| PREMIUM_PLUS | 50 | 200 | ₹129/year |

Upgrade at [is-a.software/subscriptions](https://is-a.software/subscriptions).
