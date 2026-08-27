# James Phillip De Guzman — ATS-Friendly Web Resume (Netlify Edition)

A modern, responsive, ATS-optimized, and privacy-shielded interactive web resume configured for seamless **Netlify** deployment.

🔗 **Live Public Resume**: [https://resume-jpd.netlify.app/](https://resume-jpd.netlify.app/)

---

## 🚀 Key Architectural & Privacy Features

- **Live URL**: Accessible globally at [https://resume-jpd.netlify.app/](https://resume-jpd.netlify.app/).
- **ATS-Optimized DOM Structure**: Clean, semantic HTML5 tags (`<header>`, `<main>`, `<section>`, `<article>`, `<ul>`, `<li>`, `<time>`) with structured heading hierarchy so automated ATS parsers easily index skills, education, and career experience.
- **Dual-Mode Privacy Contact Shield**:
  1. **Passcode Unlock via Netlify Serverless Function**: Verified against Netlify Environment Variables (`process.env.RECRUITER_PASSCODE`), returning contact PII only on successful authentication (default code: `BPW2026`).
  2. **Direct Netlify HTML Form (`data-netlify="true"`)**: Recruiters can send a message directly from the page without you needing to expose an email address to web scrapers.
- **Privacy Shield & `.gitignore` Separation**: All environment variables, sensitive local configs, and build caches are safely excluded from the public GitHub repository.
- **Print & PDF Export Ready**: `@media print` eliminates toolbar items and forms for a clean, professional PDF resume export (`Ctrl + P`).

---

## 📁 File Structure

```text
├── index.html                           # Root web entry (Netlify build output)
├── netlify.toml                         # Netlify build settings & security headers
├── .gitignore                           # Excludes .env and sensitive files
├── .env.example                         # Example environment variables template
├── netlify/
│   └── functions/
│       └── unlock-contact.js            # Netlify Serverless Function for passcode unlock
├── styles/
│   └── resume.css                       # Two-column layout, UI tokens, and print media query
├── scripts/
│   └── resume.js                        # Form handling, passcode verification & tab logic
└── README.md                            # Documentation & deployment guide
```

---

## 🌐 Deploying to Netlify

- **Live Production URL**: [https://resume-jpd.netlify.app/](https://resume-jpd.netlify.app/)
- **Repository**: [https://github.com/jamesphillipdeguzman/resume](https://github.com/jamesphillipdeguzman/resume)

### Netlify Build Settings
Build settings are automatically detected via [`netlify.toml`](netlify.toml):
- **Publish directory**: `.`
- **Functions directory**: `netlify/functions`

### Netlify Environment Variables
In your Netlify Dashboard, navigate to **Site configuration** &gt; **Environment variables** to manage:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `RECRUITER_PASSCODE` | `BPW2026` | Custom secret passcode for recruiters |
| `CONTACT_EMAIL` | `your-email@example.com` | Revealed only upon entering valid passcode |
| `CONTACT_PHONE` | `+63 9XX XXX XXXX` | Revealed only upon entering valid passcode |
| `CONTACT_LOCATION` | `City, Country` | Candidate work location |

---

## 📬 Receiving Recruiter Form Messages
Submissions made via the **"Message Me"** tab are automatically captured by Netlify Forms.
- View submissions directly in **Netlify Dashboard > Forms > recruiter-contact**.
- Optionally enable instant **Email Notifications** in Netlify to receive recruiter messages in real time.
