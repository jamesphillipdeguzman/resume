# James Phillip De Guzman — ATS-Friendly Web Resume (Netlify Edition)

A modern, responsive, ATS-optimized, and privacy-shielded interactive web resume configured for seamless **Netlify** deployment.

---

## 🚀 Key Architectural & Privacy Features

- **ATS-Optimized DOM Structure**: Clean, semantic HTML5 tags (`<header>`, `<main>`, `<section>`, `<article>`, `<ul>`, `<li>`, `<time>`) with structured heading hierarchy so automated ATS parsers easily index skills, education, and career experience.
- **Dual-Mode Privacy Contact Shield**:
  1. **Passcode Unlock via Netlify Serverless Function**: Verified against Netlify Environment Variables (`process.env.RECRUITER_PASSCODE`), returning contact PII only on successful authentication (default code: `BPW2026`).
  2. **Direct Netlify HTML Form (`data-netlify="true"`)**: Recruiters can send a message directly from the page without you needing to expose an email address to web scrapers.
- **Privacy Shield & `.gitignore` Separation**: All environment variables, sensitive local configs, and build caches are safely excluded from the public GitHub repository.
- **Print & PDF Export Ready**: `@media print` eliminates toolbar items and forms for a clean 1–2 page PDF resume export (`Ctrl + P`).

---

## 📁 File Structure

```text
├── index.html                           # Root web entry (Netlify build output)
├── resume.html                          # Semantic HTML5 resume markup
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

## 🌐 Deploying to Netlify in 3 Steps

### Step 1: Push Repository to GitHub
```bash
git add .
git commit -m "Deploy ATS resume with Netlify Forms & Serverless Unlock"
git push -u origin main
```

### Step 2: Import Project to Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** &gt; **"Import an existing project"**.
3. Select your GitHub repository (`jamesphillipdeguzman/resume`).
4. Build settings will automatically detect [`netlify.toml`](netlify.toml):
   - **Publish directory**: `.`
   - **Functions directory**: `netlify/functions`

### Step 3: Configure Netlify Environment Variables (Optional)
In your Netlify Dashboard, navigate to **Site configuration** &gt; **Environment variables** and add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `RECRUITER_PASSCODE` | `BPW2026` | Custom secret passcode for recruiters |
| `CONTACT_EMAIL` | `your-email@example.com` | Revealed only upon entering valid passcode |
| `CONTACT_PHONE` | `+63 9XX XXX XXXX` | Revealed only upon entering valid passcode |
| `CONTACT_LOCATION` | `Metro Manila, PH` | Candidate work location |

---

## 📬 Receiving Recruiter Form Messages
Submissions made via the **"Message Me"** tab are automatically captured by Netlify Forms.
- View submissions directly in **Netlify Dashboard > Forms > recruiter-contact**.
- Optionally enable instant **Email Notifications** in Netlify to receive recruiter messages in real time.
