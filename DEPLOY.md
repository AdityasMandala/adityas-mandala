# Deploying Adityas Mandala — Quick Start

## 1. Check you have Git
Open Terminal and run:
    git --version
If you see a version number, you're set. If not, install from git-scm.com.

## 2. Push this folder to GitHub
    cd adityas-mandala-website
    git init
    git add .
    git commit -m "Initial site"

Then go to github.com → New Repository → name it (e.g. `adityas-mandala`) → don't initialize with a README → create.
GitHub will show you two commands to run — copy/paste them exactly, they'll look like:

    git remote add origin https://github.com/YOUR-USERNAME/adityas-mandala.git
    git branch -M main
    git push -u origin main

## 3. Deploy on Vercel
- Go to vercel.com → Sign up → "Continue with GitHub" (uses your GitHub login, no new password)
- Click "Add New Project" → select your `adityas-mandala` repo → Deploy
- No build settings needed — it's a static site, Vercel detects that automatically
- You'll get a live URL in about 30 seconds (something like adityas-mandala.vercel.app)

## 4. Future edits
Every time you `git push` a change, Vercel automatically redeploys. No manual re-upload ever.

## 5. Custom domain (whenever you're ready)
Vercel → your project → Settings → Domains → add adityasmandala.com (or whatever you register) and follow the DNS instructions it gives you.
