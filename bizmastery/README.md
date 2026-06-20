# BizMastery — Business Zero to Mastery

Full production website with Mailchimp email capture, PDF auto-delivery, and Vercel hosting.

---

## WHAT THIS INCLUDES

- `public/index.html` — Full multi-page website (6 pages, 100+ business types, all 50 states)
- `api/server.js` — Express.js backend with Mailchimp + PDF email delivery
- `vercel.json` — Vercel deployment config
- `.env.example` — Environment variable template

---

## DEPLOY IN 4 STEPS

### STEP 1 — Get Your Free Accounts (10 min)

1. **GitHub** — github.com/signup (free)
2. **Vercel** — vercel.com/signup (free, sign up with GitHub)
3. **Mailchimp** — mailchimp.com (free up to 500 contacts)
4. **Gmail** — Use any Gmail account for sending emails

---

### STEP 2 — Get Your API Keys (15 min)

**Mailchimp API Key:**
1. Login to Mailchimp → click your name (bottom left) → Account & Billing
2. Go to Extras → API Keys → Create A Key
3. Copy the key (looks like: abc123def456-us21)
4. The last part after the dash is your SERVER PREFIX (e.g. "us21")

**Mailchimp List ID:**
1. In Mailchimp → Audience → All Contacts → Settings → Audience name and defaults
2. Copy the "Audience ID" (looks like: a1b2c3d4e5)

**Gmail App Password:**
1. Go to myaccount.google.com → Security
2. Enable 2-Step Verification (required)
3. Search "App Passwords" → create one named "BizMastery"
4. Copy the 16-character password (like: abcd efgh ijkl mnop)

---

### STEP 3 — Push Code to GitHub (5 min)

1. Go to github.com → New Repository → name it "bizmastery" → Create
2. Open your terminal/command prompt in the bizmastery folder:

```bash
git init
git add .
git commit -m "Initial BizMastery build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bizmastery.git
git push -u origin main
```

---

### STEP 4 — Deploy on Vercel (5 min)

1. Go to vercel.com → New Project → Import from GitHub → select "bizmastery"
2. Click "Environment Variables" and add these one by one:

| KEY                  | VALUE                        |
|----------------------|------------------------------|
| MAILCHIMP_API_KEY    | your full API key            |
| MAILCHIMP_LIST_ID    | your audience ID             |
| MAILCHIMP_SERVER     | us21 (or your prefix)        |
| EMAIL_USER           | youremail@gmail.com          |
| EMAIL_PASS           | your 16-char app password    |

3. Click **Deploy** — Vercel builds and deploys in ~60 seconds
4. Your site is live at: `https://bizmastery.vercel.app`

---

### STEP 5 — Connect Your Custom Domain

**Buy a domain (choose one):**
- Namecheap.com (~$10/yr) — best value
- GoDaddy.com (~$12/yr)
- Google Domains (~$12/yr)

**Recommended domain names:**
- bizmastery.com
- bizmastery.co
- mybizmastery.com
- startbizmastery.com

**Connect to Vercel:**
1. Vercel dashboard → your project → Settings → Domains
2. Click Add Domain → type your domain name
3. Vercel shows you DNS records to add
4. In your domain registrar (Namecheap/GoDaddy) → DNS settings → add the records Vercel shows
5. Takes 5–30 minutes to go live

---

## LOCAL DEVELOPMENT

```bash
# Install dependencies
npm install

# Copy env file and fill in your keys
cp .env.example .env

# Run locally
npm run dev

# Open http://localhost:3000
```

---

## HOW THE EMAIL FLOW WORKS

1. User visits site → enters email on "Free Guide" page
2. Frontend sends POST to `/api/subscribe` with the email
3. Backend adds email to your Mailchimp audience with tag "bizmastery-guide"
4. Backend generates the full PDF guide dynamically using PDFKit
5. Backend emails the PDF as an attachment to the user via Gmail
6. User receives branded email with PDF attached within ~30 seconds

---

## TECH STACK

- **Frontend:** Vanilla HTML/CSS/JS (no framework, instant loading)
- **Backend:** Node.js + Express.js
- **PDF:** PDFKit (generates PDF in memory, no storage needed)
- **Email:** Nodemailer + Gmail SMTP
- **Lists:** Mailchimp REST API v3
- **Hosting:** Vercel (serverless, free tier covers up to 100k requests/month)

---

## SUPPORT

Questions? Open an issue on GitHub or email via your BizMastery contact form.
