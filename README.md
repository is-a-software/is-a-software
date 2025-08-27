<h1 align="center">is-a.software</h1>

<p align="center">
  Free and automated DNS subdomains for developers.
  <br />
  <a href="#-how-to-register-a-subdomain"><strong>Register a Subdomain »</strong></a>
</p>

---

## ❗ What is is-a.software?

`is-a.software` is a free service that provides developers with a professional `.is-a.software` subdomain for their personal projects, portfolios, or open-source work. The entire process is automated and managed through GitHub.

## ❓ How to Register a Subdomain

### 1. 🍴 Fork the Repository
First, [fork this repository](https://github.com/is-a-software/is-a-software/fork) to your own GitHub account.

### 2. 📝 Create Your Record File
Navigate to the `domains/` folder and create a new JSON file. The name of this file will be your subdomain.

> **For example:** To register `example.is-a-software`, you must create a file named `example.json`.

### 3. ⚙️ Add Your DNS Records
Open your new JSON file and add the required information. You must include an `owner` section and a `record` section.

* **`owner`**: Your GitHub username. This must match the GitHub username of the Pull Request author.
* **`record`**: The DNS records you want. We support `A`, `AAAA`, and `CNAME`. `NS` and `MX` records are not allowed for security and management reasons.
* **`proxy`** (Optional): Set to `true` to enable Cloudflare's proxy (orange cloud) for performance and security benefits, or `false` to disable it (DNS only). Defaults to `false`.

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
Once you've created and saved your file, create a Pull Request from your fork back to this main repository. All checks must pass for the PR to be automatically merged.

Your subdomain should be live within a few minutes after the PR is merged!

> [!NOTE]
> **Make sure to add a good commit message and a good PR title**<br>
> example: `Register: example.is-a.software`<br>

---

## 🏗️ Project Architecture & Automation

This project leverages GitHub Actions and Cloudflare to provide a fully automated subdomain registration and DNS management service.

### Overall Flow
The process begins when a user creates a Pull Request with their desired subdomain configuration. This PR is then automatically validated. If valid, it's auto-merged, triggering a DNS synchronization script that updates Cloudflare.

### Key Components

*   **`domains/` folder:** This directory serves as the single source of truth for all registered subdomains. Each JSON file within this folder represents a subdomain and its associated DNS records.

*   **`scripts/validate-pr.js`:** This Node.js script is executed as part of the PR validation process. It enforces several rules to ensure the integrity and security of the system:
    *   Ensures the PR modifies exactly one file.
    *   Verifies that the modified file is a `.json` file located within the `domains/` folder.
    *   Checks that the requested subdomain name is not a [reserved keyword](#reserved-keywords).
    *   Validates the JSON structure, ensuring the `owner.github` field exists and matches the GitHub username of the PR author.
    *   Disallows `NS` and `MX` record types to maintain control over DNS delegation.
    *   If any validation fails, it adds a comment to the Pull Request indicating the issue.

*   **`scripts/dnsconfig.js`:** This Node.js script is the core of the DNS management system. It performs the following actions:
    *   Reads all JSON files from the `domains/` folder to determine the desired DNS state.
    *   Fetches the current DNS records from Cloudflare for the `is-a.software` zone.
    *   Compares the desired state with the current Cloudflare records.
    *   Creates new records, updates existing ones, or deletes orphaned records on Cloudflare to ensure the DNS configuration matches the `domains/` folder.
    *   It uses Cloudflare API tokens (stored as GitHub Secrets) for authentication.

### GitHub Actions Workflows

The automation is orchestrated by several GitHub Actions workflows located in the `.github/workflows/` directory:

*   **`validate-pr.yml`:**
    *   **Trigger:** Runs automatically when a Pull Request is `opened`, `synchronize` (new commits are pushed to an existing PR), or `reopened`.
    *   **Function:** Checks out the PR's content and executes `scripts/validate-pr.js`.
    *   **Outcome:** If validation passes, it adds the labels `validation:passed` and `automerge` to the Pull Request, signaling it for automatic merging.

*   **`auto-merge.yml`:**
    *   **Trigger:** Runs when a Pull Request receives the `validation:passed` label.
    *   **Function:** Uses the `pascalgn/automerge-action` to automatically merge the Pull Request into the `main` branch. Commits are squashed during the merge for a cleaner history.

*   **`dnsconfig.yml`:**
    *   **Trigger:** Runs automatically on every `push` to the `main` branch (which occurs after a PR is merged) or can be triggered manually via `workflow_dispatch`.
    *   **Function:** Checks out the latest code, sets up Node.js, and executes `scripts/dnsconfig.js` to synchronize the DNS records with Cloudflare.

### Cloudflare Integration
Cloudflare is used as the DNS provider for `is-a.software`. The `dnsconfig.js` script interacts directly with the Cloudflare API to manage DNS records. Users can optionally enable Cloudflare's proxy (orange cloud) for their subdomains, which provides performance benefits (caching) and security features (DDoS protection) by routing traffic through Cloudflare's network.

### Reserved Keywords
The following keywords are reserved and cannot be used as subdomain names:
```json
["admin", "api", "abuse", "blog", "cloudflare", "contact", "dev", "docs", "email", "ftp", "git", "github", "google", "help", "imap", "is-a-software", "mail", "ns1", "ns2", "owner", "pop", "shop", "smtp", "status", "support", "test", "webmail", "www"]
```

---

## 🆘 Need help?
Join our Discord server for any kind of help.

<a href="https://discord.com/invite/AeAjegXn6D">
  <img src="https://invidget.switchblade.xyz/AeAjegXn6D" alt="Discord Server">
</a>

## 🙏 Support
Don't forget to leave a star ⭐

<a href="#"> <img src="https://oyepriyansh.pages.dev/i/895dfb4d98fgcf5e.gif" alt="star repo gif"> </a>

---

## 🤝 Contributing to the Project

We welcome contributions to improve the `is-a.software` project itself! If you're interested in enhancing the scripts, improving documentation, or adding new features, here's how you can help:

1.  **Fork the Repository:** Start by forking this repository to your GitHub account.
2.  **Clone Your Fork:** Clone your forked repository to your local machine.
3.  **Make Changes:** Implement your desired changes. This project uses Node.js for its scripts and GitHub Actions for automation.
4.  **Test Your Changes:** Ensure your changes work as expected and do not introduce regressions.
5.  **Create a Pull Request:** Push your changes to your fork and create a Pull Request back to the `main` branch of the `is-a.software` repository.
6.  **Describe Your Changes:** Provide a clear and concise description of your changes in the PR, explaining their purpose and impact.

Your contributions help keep this service free and robust for the developer community!