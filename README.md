<h1 align="center">is-a.software</h1>

<p align="center">
  Free and automated DNS subdomains for developers.
  <br />
  <a href="#how-to-register-a-subdomain"><strong>Register a Subdomain »</strong></a>
</p>

---

## ❗ What is is-a.software?

`is-a.software` is a free service that provides developers with a professional `.is-a.software` subdomain for their personal projects, portfolios, or open-source work. The entire process is automated and managed through GitHub.

## ❓ How to Register a Subdomain

### 1. 🍴  Fork the Repository
First, [fork this repository](https://github.com/is-a-software/is-a-software/fork) to your own GitHub account.

### 2. 📝 Create Your Record File
Navigate to the `domains/` folder and create a new JSON file. The name of this file will be your subdomain.

> **For example:** To register `example.is-a-software`, you must create a file named `example.json`.

### 3. ⚙️ Add Your DNS Records
Open your new JSON file and add the required information. You must include an `owner` section and a `record` section.

* **`owner`**: Your GitHub username.
* **`record`**: The DNS records you want. We support `A`, `AAAA`, and `CNAME`.
* **`proxy`** (Optional): Set to `true` to enable Cloudflare's proxy (orange cloud) or `false` to disable it (DNS only). Defaults to `false`.

#### **JSON File Examples**

**Using a CNAME record (for services like GitHub Pages, Vercel, etc.):**
```json
{
  "owner": {
    "github": "your-username"
  },
  "record": {
    "CNAME": "your-username.github.io"
  },
  "proxy": false
}
```

### 4. 🚀 Create a Pull Request
Once you've created and saved your file, create a Pull Request from your fork back to this main repository.  all checks pass,then it will be automatically merged.

Your subdomain should be live within a few minutes!

> [!NOTE]
> **Make sure to add a good commit message and a good PR title**<br>
> example: `Register: example.is-a.software`<br>

##  🆘 Need help?
Join our Discord server for any kind of help.

<a href="https://discord.com/invite/AeAjegXn6D">
  <img src="https://invidget.switchblade.xyz/AeAjegXn6D" alt="Discord Server">
</a>

## 🙏 Support
Don't forget to leave a star ⭐

<a href="#"> <img src="https://oyepriyansh.pages.dev/i/895dfb4d98fgcf5e.gif" alt="star repo gif"> </a>


