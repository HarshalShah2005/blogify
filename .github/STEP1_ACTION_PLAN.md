# STEP 1 ACTION PLAN - Quick Start

## What You Need to Do (In Order)

### 1. AWS Account & Credentials (20 minutes)
Follow [AWS_SETUP_GUIDE.md](AWS_SETUP_GUIDE.md):
- [ ] Create AWS account (if needed)
- [ ] Create IAM user `medium-cicd`
- [ ] Generate Access Key ID and Secret Access Key
- [ ] Enable cost alerts
- [ ] Save credentials securely

**Output:** 
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

---

### 2. GitHub Repository (10 minutes)
Follow [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) - Part A:
- [ ] Create GitHub repository at https://github.com/new
- [ ] Name it: `medium`
- [ ] Make it Private
- [ ] Run:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/medium.git
  git branch -M main
  git push -u origin main
  ```
- [ ] Verify code appears on GitHub

**Output:** GitHub repository with your code

---

### 3. GitHub Secrets (5 minutes)
Follow [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) - Part B:

Go to: https://github.com/YOUR_USERNAME/medium/settings/secrets/actions

Add these secrets:
```
AWS_ACCESS_KEY_ID          = (from AWS step)
AWS_SECRET_ACCESS_KEY      = (from AWS step)
AWS_REGION                 = us-east-1
DATABASE_URL               = postgresql://user:pass@localhost/medium (placeholder)
JWT_SECRET                 = (generate: openssl rand -hex 32)
VITE_GOOGLE_GENERATIVE_AI_API_KEY = (your Gemini API key if available)
```

**Output:** 6+ secrets configured in GitHub

---

### 4. GitHub Environments (5 minutes)
Follow [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) - Part C:

Go to: https://github.com/YOUR_USERNAME/medium/settings/environments

Create three environments:
- [ ] **development** - No restrictions
- [ ] **staging** - Requires 1 reviewer
- [ ] **production** - Requires 1 reviewer + only you can deploy

**Output:** 3 environments configured

---

### 5. Branch Protection (5 minutes)
Follow [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) - Part D:

Go to: https://github.com/YOUR_USERNAME/medium/settings/branches

Add rule for `main` branch:
- [ ] Require pull request reviews (1 reviewer)
- [ ] Require status checks to pass
- [ ] Require branches up to date
- [ ] Include administrators

**Output:** Main branch is protected

---

### 6. GitHub Actions Permissions (2 minutes)
Follow [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) - Part E:

Go to: https://github.com/YOUR_USERNAME/medium/settings/actions/general

Configure:
- [ ] Actions permissions: "Allow all actions"
- [ ] Workflow permissions: "Read and write"
- [ ] Allow GitHub Actions to create pull requests

**Output:** Actions permissions configured

---

### 7. Push Workflow Files (2 minutes)

The workflow files are already created:
- ✅ `.github/workflows/01-backend-ci.yml`
- ✅ `.github/workflows/02-frontend-ci.yml`

Push them to GitHub:
```bash
git add .github/
git commit -m "Add GitHub Actions CI/CD workflows"
git push origin main
```

**Output:** Workflows appear in GitHub Actions tab

---

### 8. Verify Everything Works (5 minutes)

1. **Go to GitHub Actions:**
   - Visit: https://github.com/YOUR_USERNAME/medium/actions
   - You should see workflow runs starting
   - (They may fail initially - that's OK for this step)

2. **Check Secrets:**
   - Go to Settings → Secrets → Actions
   - Verify all 6+ secrets are listed

3. **Check Environments:**
   - Go to Settings → Environments
   - Verify 3 environments exist

4. **Check Branch Protection:**
   - Go to Settings → Branches
   - Verify `main` rule exists

---

## Files You'll Reference

| Document | Purpose |
|----------|---------|
| [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) | Detailed GitHub configuration |
| [AWS_SETUP_GUIDE.md](AWS_SETUP_GUIDE.md) | AWS account and credentials setup |
| [STEP1_CHECKLIST.md](STEP1_CHECKLIST.md) | Detailed checklist with troubleshooting |
| `workflows/01-backend-ci.yml` | Backend testing workflow |
| `workflows/02-frontend-ci.yml` | Frontend testing workflow |

---

## Estimated Time: ~1 hour total

- AWS Setup: 20 min
- GitHub Repo: 10 min
- Secrets: 5 min
- Environments: 5 min
- Branch Protection: 5 min
- Permissions: 2 min
- Push Workflows: 2 min
- Verification: 5 min

---

## What Happens After Step 1?

✅ **Step 1 Complete:**
- GitHub repository ready
- Secrets and environments configured
- Branch protection enabled
- CI workflows starting automatically
- Code changes trigger automated tests

⏭️ **Step 2: Docker Setup**
- Create Dockerfiles for backend and frontend
- Create docker-compose for local testing
- Test containers locally before pushing to AWS

---

## Having Issues?

**Refer to:** [STEP1_CHECKLIST.md](STEP1_CHECKLIST.md) → "Common Issues & Solutions"

Common problems:
- Secrets not found → Wait 5 minutes
- Workflows not running → Check file syntax
- Git push rejected → Check branch protection rules
- AWS errors → Verify credentials in GitHub Secrets

---

## When You're Done

Reply in the chat with:
- ✅ All 8 steps completed
- Any errors you encountered (we'll fix them)
- Screenshot of GitHub Actions tab showing workflows (optional)

Then we'll proceed to **Step 2: Docker Setup** 🐳

