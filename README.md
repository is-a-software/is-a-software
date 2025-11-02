<div align="center">
  <h1>is-a.software</h1>
  <p>Get your free .is-a.software subdomain for developers. Perfect for side projects, demos, and showcasing your work to the world.</p>
  <a href="https://is-a.software/about">About</a> | <a href="https://is-a.software/terms">Terms of Service</a> | <a href="https://is-a.software/privacy">Privacy Policy</a>
  <br/><br/>
  <p>
    <a href="#"><img src="https://img.shields.io/github/stars/is-a-software/is-a-software?style=for-the-badge" alt="GitHub Stars"></a>
    <a href="#"><img src="https://img.shields.io/github/directory-file-count/is-a-software/is-a-software/domains?style=for-the-badge&label=domains" alt="Domains"></a>
    <a href="https://discord.com/invite/AeAjegXn6D"><img src="https://img.shields.io/discord/855711432581316639?color=5865F2&logo=discord&logoColor=white&style=for-the-badge" alt="Discord Server"></a>
  </p>
</div>

---

## 🚀 How to Register Your Subdomain

You can get your free subdomain using either of the following methods:

### Option 1: Dashboard Registration (Recommended)

1. Go to [is-a.software](https://is-a.software)
2. Sign in with your GitHub account
3. Search for and claim your subdomain
4. Manage your DNS records directly from the dashboard

---

### Option 2: GitHub Pull Request (Classic Method)

1. 🍴 **Fork this repository** to your own GitHub account.
2. 📝 **Create a JSON file** in the `domains/` folder. The file name will be your subdomain.
   - Example: To register `example.is-a-software`, create `domains/example.json`.
3. ⚙️ **Add your DNS records** in the JSON file.  
   - Include your GitHub username as `owner`.
   - Add your desired DNS records (`A`, `AAAA`, `CNAME`, etc.).
4. 🚀 **Create a Pull Request** back to this repository.  
   - If all checks pass, your PR will be auto-merged and your subdomain will be live soon!

#### **JSON Example**
```json
{
  "owner": {
    "github": "your-username"
  },
  "record": {
    "CNAME": "your-username.github.io"
  }
}
```

---

## 🤝 Contributing

This is a community project, and we welcome contributions! Whether it's improving the scripts, updating the documentation, or fixing a bug, your help is appreciated.

1.  **Fork the repository** and create a new branch.
2.  Make your changes.
3.  Open a **Pull Request** with a clear description of what you've done.

## 💬 Need Help?

Join our official Discord server for support, questions, or just to chat with the community.

<a href="https://discord.com/invite/AeAjegXn6D">
  <img src="https://invidget.switchblade.xyz/AeAjegXn6D" alt="Discord Server Invite">
</a>

---

<div align="center">
  <p>Licensed under the <a href="LICENSE">MIT License</a>.</p>
  <p>Don't forget to ⭐ the repository if you find it useful!</p>
</div>
