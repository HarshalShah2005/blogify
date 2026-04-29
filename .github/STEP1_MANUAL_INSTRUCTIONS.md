# STEP 1: Complete Manual Instructions - What YOU Need to Do

Follow these steps **exactly in order**. Copy-paste commands where provided.

---

## PART 1: AWS SETUP (20 minutes)

### Step 1.1: Create AWS Account

1. **Open browser and go to:** https://aws.amazon.com/
2. **Click:** "Create an AWS account" (top right)
3. **Fill in:**
   - Email address: Your email
   - Password: Strong password (min 8 chars, mix of upper/lower/numbers/symbols)
   - AWS account name: Your name or company name
4. **Click:** "Continue"
5. **Fill in contact information:**
   - Country: Your country
   - Full name: Your name
   - Address, City, State, Zip
   - Phone number: Your phone number
6. **Accept terms and click:** "Create Account and Continue"
7. **Add payment method:**
   - Credit/Debit card number
   - Expiry date
   - CVV
   - Billing address (usually same as contact)
8. **Click:** "Verify and Add"
9. **Confirm phone number:**
   - You'll get an SMS
   - Enter the code
10. **Choose support plan:** Select **"Basic Support (Free)"**
11. **Done!** You'll get confirmation email

⏸️ **Wait for email:** "Welcome to Amazon Web Services" (usually instant)

---

### Step 1.2: Create IAM User for CI/CD

Once your AWS account is ready:

1. **Go to:** https://console.aws.amazon.com/iam/
2. **Sign in** with your AWS email and password
3. **Left sidebar → Click:** "Users"
4. **Click:** "Create user" button
5. **Enter user name:** `medium-cicd`
6. **Click:** "Next"
7. **Select:** "Attach policies directly"
8. **Search and CHECK these boxes** (type in search box):
   - [ ] AmazonEC2FullAccess
   - [ ] AmazonRDSFullAccess
   - [ ] AmazonECS_FullAccess
   - [ ] CloudFrontFullAccess
   - [ ] AmazonS3FullAccess
   - [ ] EC2ContainerRegistryFullAccess
   - [ ] CloudWatchFullAccess
   - [ ] AWSSecretsManagerFullAccess

9. **Click:** "Next"
10. **Review and click:** "Create user"

---

### Step 1.3: Generate Access Keys

1. **You're back at Users page, click on:** `medium-cicd` (the user you just created)
2. **Go to tab:** "Security credentials"
3. **Scroll down to:** "Access keys" section
4. **Click:** "Create access key"
5. **Select:** "Application running outside AWS"
6. **Click:** "Create access key"
7. **⚠️ IMPORTANT: Copy and save these values somewhere safe:**

```
Access Key ID: AKIA__________ (copy this)
Secret Access Key: ________________ (copy this)
```

**Option A:** Click "Download .csv file" (safest)
**Option B:** Copy to a notepad temporarily

⚠️ **You can ONLY see these once! Write them down now!**

---

### Step 1.4: Enable Cost Alerts (Recommended)

1. **Go to:** https://console.aws.amazon.com/billing/
2. **Left sidebar → Click:** "Budgets"
3. **Click:** "Create budget"
4. **Select:** "Cost"
5. **Enter:**
   - Budget amount: `10` (USD)
   - Budget name: `Monthly Alert`
6. **Click:** "Next"
7. **Enter your email** to receive alerts
8. **Click:** "Next"
9. **Review and click:** "Create budget"

✅ **AWS Setup Complete!** You now have:
- AWS account
- IAM user: `medium-cicd`
- Access Key ID
- Secret Access Key

---

## PART 2: GITHUB REPOSITORY SETUP (10 minutes)

### Step 2.1: Create GitHub Repository

1. **Open:** https://github.com/new
2. **If not logged in, click** "Sign in" and login with your GitHub account
   - (If you don't have GitHub account, go to https://github.com/signup first)
3. **Fill in:**
   - Repository name: `medium`
   - Description: `Full-stack blogging platform with AI features and CI/CD`
   - Visibility: **PRIVATE** (recommended) or Public
4. **DO NOT CHECK:** "Initialize this repository with"
5. **Click:** "Create repository"

✅ **You'll see a blank repository page with setup instructions**

---

### Step 2.2: Push Your Code to GitHub

1. **Open Terminal/PowerShell on your computer**
2. **Navigate to your project directory:**
   ```powershell
   cd "C:\Users\Harshal Shah\Documents\Coding\WebDev\projects\medium"
   ```

3. **Run these commands one by one:**

   ```powershell
   # Check current git status
   git status
   ```
   
   You should see files ready to commit.

4. **Check if remote is already set:**
   ```powershell
   git remote -v
   ```
   
   - If you see output with `https://github.com/...`, skip to step 2.5
   - If you see nothing, continue to step 2.3

5. **Add GitHub repository as remote:**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/medium.git
   ```
   
   Replace `YOUR_USERNAME` with your actual GitHub username!

6. **Rename branch to main:**
   ```powershell
   git branch -M main
   ```

7. **Push code to GitHub:**
   ```powershell
   git push -u origin main
   ```
   
   - You'll see: "Enumerating objects..." and progress
   - Wait for it to finish
   - Should show: "✓ main → main"

✅ **Verify on GitHub:**
1. Go to: https://github.com/YOUR_USERNAME/medium
2. You should see:
   - ✅ `backend/` folder
   - ✅ `frontend/` folder
   - ✅ `.github/` folder with workflows
   - ✅ All your code files

---

## PART 3: GITHUB SECRETS SETUP (5 minutes)

### Step 3.1: Add Secrets to GitHub

1. **Go to:** https://github.com/YOUR_USERNAME/medium/settings/secrets/actions
2. **You should see** "Repository secrets" section

### Add Secret #1: AWS Access Key
1. **Click:** "New repository secret" button
2. **Name:** `AWS_ACCESS_KEY_ID`
3. **Value:** (paste the Access Key ID from Step 1.3)
4. **Click:** "Add secret"

### Add Secret #2: AWS Secret Key
1. **Click:** "New repository secret"
2. **Name:** `AWS_SECRET_ACCESS_KEY`
3. **Value:** (paste the Secret Access Key from Step 1.3)
4. **Click:** "Add secret"

### Add Secret #3: AWS Region
1. **Click:** "New repository secret"
2. **Name:** `AWS_REGION`
3. **Value:** `us-east-1`
4. **Click:** "Add secret"

### Add Secret #4: Database URL
1. **Click:** "New repository secret"
2. **Name:** `DATABASE_URL`
3. **Value:** `postgresql://user:password@localhost:5432/medium`
4. **Click:** "Add secret"

### Add Secret #5: JWT Secret
1. **In PowerShell, generate JWT secret:**
   ```powershell
   openssl rand -hex 32
   ```
   Copy the output (a long random string)

2. **Click:** "New repository secret"
3. **Name:** `JWT_SECRET`
4. **Value:** (paste the string from above)
5. **Click:** "Add secret"

### Add Secret #6: Gemini API (OPTIONAL - only if you have it)
1. **Click:** "New repository secret"
2. **Name:** `VITE_GOOGLE_GENERATIVE_AI_API_KEY`
3. **Value:** (your Google Gemini API key)
4. **Click:** "Add secret"

✅ **You should see 5-6 secrets listed**

---

## PART 4: GITHUB ENVIRONMENTS SETUP (5 minutes)

### Step 4.1: Create Development Environment

1. **Go to:** https://github.com/YOUR_USERNAME/medium/settings/environments
2. **Click:** "New environment"
3. **Environment name:** `development`
4. **Click:** "Configure environment"
5. **No changes needed for dev environment**
6. **Click:** "Save protection rules"

### Step 4.2: Create Staging Environment

1. **Click:** "New environment"
2. **Environment name:** `staging`
3. **Click:** "Configure environment"
4. **Enable:** "Require reviewers"
   - [ ] Check the box
5. **Number of reviewers:** `1`
6. **Click:** "Save protection rules"

### Step 4.3: Create Production Environment

1. **Click:** "New environment"
2. **Environment name:** `production`
3. **Click:** "Configure environment"
4. **Enable:** "Require reviewers"
   - [ ] Check the box
5. **Number of reviewers:** `1`
6. **Scroll down, Enable:** "Restrict who can deploy to production"
   - [ ] Check the box
   - Select your GitHub username
7. **Enable:** "Dismiss stale pull request approvals when new commits are pushed"
   - [ ] Check the box
8. **Click:** "Save protection rules"

✅ **You should see 3 environments: development, staging, production**

---

## PART 5: BRANCH PROTECTION SETUP (5 minutes)

### Step 5.1: Add Main Branch Protection

1. **Go to:** https://github.com/YOUR_USERNAME/medium/settings/branches
2. **Click:** "Add rule"
3. **Branch name pattern:** `main`
4. **Check these boxes:**
   - [ ] "Require a pull request before merging"
   - [ ] "Require approvals" (set to 1)
   - [ ] "Require status checks to pass before merging"
   - [ ] "Require branches to be up to date before merging"
   - [ ] "Require code reviews before merging"
   - [ ] "Dismiss stale pull request approvals when new commits are pushed"
5. **Click:** "Create"

✅ **Main branch is now protected**

---

## PART 6: GITHUB ACTIONS PERMISSIONS (2 minutes)

### Step 6.1: Configure Actions Permissions

1. **Go to:** https://github.com/YOUR_USERNAME/medium/settings/actions/general
2. **Under "Actions permissions", select:**
   - ◉ "Allow all actions and reusable workflows"
3. **Under "Workflow permissions", check:**
   - ☑ "Read and write permissions"
   - ☑ "Allow GitHub Actions to create and approve pull requests"
4. **Click:** "Save"

✅ **Actions permissions configured**

---

## PART 7: VERIFY WORKFLOW FILES & PUSH (3 minutes)

### Step 7.1: Verify Workflow Files Exist Locally

1. **In PowerShell:**
   ```powershell
   cd "C:\Users\Harshal Shah\Documents\Coding\WebDev\projects\medium"
   
   # Check if workflows exist
   ls -la .github/workflows/
   ```

   You should see:
   - `01-backend-ci.yml`
   - `02-frontend-ci.yml`

2. **If files don't exist, I'll create them now** (let me know)

### Step 7.2: Push Workflow Files to GitHub

1. **In PowerShell:**
   ```powershell
   cd "C:\Users\Harshal Shah\Documents\Coding\WebDev\projects\medium"
   
   # Check what's changed
   git status
   ```

2. **Add and commit the workflow files:**
   ```powershell
   git add .github/
   git commit -m "Add GitHub Actions CI/CD workflows"
   ```

3. **Push to GitHub:**
   ```powershell
   git push origin main
   ```

✅ **Workflows are now on GitHub**

---

## PART 8: VERIFY EVERYTHING WORKS (5 minutes)

### Step 8.1: Check GitHub Actions

1. **Go to:** https://github.com/YOUR_USERNAME/medium/actions
2. **You should see workflows starting to run**
3. **Wait 30 seconds and refresh the page**
4. **You should see:**
   - ✅ "Backend CI" workflow
   - ✅ "Frontend CI" workflow
   - Status: Yellow (running) or ✅ (passed) or ❌ (failed - that's OK)

### Step 8.2: Verify Secrets

1. **Go to:** https://github.com/YOUR_USERNAME/medium/settings/secrets/actions
2. **Count the secrets:**
   - [ ] AWS_ACCESS_KEY_ID
   - [ ] AWS_SECRET_ACCESS_KEY
   - [ ] AWS_REGION
   - [ ] DATABASE_URL
   - [ ] JWT_SECRET
   - [ ] VITE_GOOGLE_GENERATIVE_AI_API_KEY (optional)
   
   Should show: **5-6 secrets**

### Step 8.3: Verify Environments

1. **Go to:** https://github.com/YOUR_USERNAME/medium/settings/environments
2. **You should see:**
   - [ ] development
   - [ ] staging
   - [ ] production

### Step 8.4: Verify Branch Protection

1. **Go to:** https://github.com/YOUR_USERNAME/medium/settings/branches
2. **You should see:**
   - [ ] "main" rule exists
   - [ ] Status shows "Branch is up to date with main"

---

## ✅ STEP 1 COMPLETE VERIFICATION CHECKLIST

- [ ] AWS account created
- [ ] IAM user `medium-cicd` created
- [ ] Access keys generated and saved
- [ ] Cost alerts enabled
- [ ] GitHub repository created (medium)
- [ ] Code pushed to GitHub (backend/, frontend/, .github/)
- [ ] 5-6 secrets added to GitHub
- [ ] 3 environments created (dev, staging, prod)
- [ ] Main branch protection enabled
- [ ] Actions permissions configured
- [ ] Workflow files pushed to GitHub
- [ ] GitHub Actions showing workflows running
- [ ] All secrets visible in Settings → Secrets
- [ ] All environments visible in Settings → Environments
- [ ] Branch protection rule visible in Settings → Branches

---

## 🎉 IF YOU'VE DONE ALL THIS:

**Come back here and reply with:**
```
✅ Step 1 Complete! All checks passed.
- AWS credentials ready
- GitHub repo with workflows
- All secrets configured
- Environments and branch protection enabled
```

**And tell me:**
- Any errors you encountered (we'll fix them)
- A screenshot of GitHub Actions tab (optional)

---

## ❓ TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| **"Repository already exists"** | Use a different name like `medium-app` |
| **"Permission denied" when pushing** | Check your SSH keys or use HTTPS URL |
| **"Secrets not found in workflows"** | Wait 5 minutes, refresh GitHub, try again |
| **"Workflows not running"** | Check `.github/workflows/*.yml` were pushed |
| **"AWS error in logs"** | Verify credentials in GitHub Secrets are correct |
| **"I don't see my code on GitHub"** | Re-run: `git push origin main` |
| **"Branch protection won't let me push"** | Create a branch: `git checkout -b feature` and push that |

---

## 📞 NEED HELP?

If you get stuck, tell me:
1. What step you're on
2. What error you see
3. A screenshot (optional)

I'll help you fix it! 🚀

