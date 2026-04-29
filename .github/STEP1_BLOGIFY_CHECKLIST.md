# STEP 1: UPDATED FOR EXISTING BLOGIFY REPO

## ✅ What's Already Done

Your existing repo: **https://github.com/HarshalShah2005/blogify**

- ✅ GitHub repository already created
- ✅ Code already pushed to main branch
- ✅ CI/CD workflow files already created and pushed:
  - `01-backend-ci.yml` (Backend tests & build)
  - `02-frontend-ci.yml` (Frontend tests & build)

---

## 🎯 What YOU Need to Do (3 Parts Left)

### **PART 1: AWS SETUP & CREDENTIALS** ⏱️ 20 minutes

Follow these steps:

1. **Create AWS Account** (if you don't have one)
   - Go to: https://aws.amazon.com
   - Click "Create an AWS account"
   - Fill in email, password, contact info, and payment method
   - Verify phone number via SMS
   - Choose "Basic Support (Free)"

2. **Create IAM User**
   - Go to: https://console.aws.amazon.com/iam/
   - Click "Users" → "Create user"
   - Name: `medium-cicd`
   - Click "Attach policies directly"
   - Search and CHECK these 8 boxes:
     - ☐ AmazonEC2FullAccess
     - ☐ AmazonRDSFullAccess
     - ☐ AmazonECS_FullAccess
     - ☐ CloudFrontFullAccess
     - ☐ AmazonS3FullAccess
     - ☐ EC2ContainerRegistryFullAccess
     - ☐ CloudWatchFullAccess
     - ☐ AWSSecretsManagerFullAccess
   - Click "Create user"

3. **Generate Access Keys**
   - Click on `medium-cicd` user
   - Go to "Security credentials" tab
   - Scroll to "Access keys" → Click "Create access key"
   - Select "Application running outside AWS"
   - **⚠️ SAVE THESE TWO:**
     ```
     Access Key ID: AKIA____________
     Secret Access Key: ________________
     ```
   - Download CSV file or copy to notepad (you can only see these once!)

4. **Enable Cost Alerts** (optional but recommended)
   - Go to: https://console.aws.amazon.com/billing/
   - Click "Budgets" → "Create budget"
   - Budget amount: `10` USD
   - Email: Your email
   - Finish setup

✅ **When done:** You have AWS Access Key ID and Secret Access Key saved

---

### **PART 2: ADD GITHUB SECRETS** ⏱️ 5 minutes

Go to: https://github.com/HarshalShah2005/blogify/settings/secrets/actions

Add these secrets ONE BY ONE:

**Secret #1:**
- Click "New repository secret"
- Name: `AWS_ACCESS_KEY_ID`
- Value: (paste from Part 1 step 3)
- Click "Add secret"

**Secret #2:**
- Click "New repository secret"
- Name: `AWS_SECRET_ACCESS_KEY`
- Value: (paste from Part 1 step 3)
- Click "Add secret"

**Secret #3:**
- Click "New repository secret"
- Name: `AWS_REGION`
- Value: `us-east-1`
- Click "Add secret"

**Secret #4:**
- Click "New repository secret"
- Name: `DATABASE_URL`
- Value: `postgresql://neondb_owner:npg_s8PjUA2GLDdw@ep-odd-breeze-adxxl9ap.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
- Click "Add secret"

**Secret #5:** Generate JWT Secret
- Open PowerShell and run:
  ```powershell
  openssl rand -hex 32
  ```
- Copy the output (long random string)
- Click "New repository secret"
- Name: `JWT_SECRET`
- Value: (paste the string from above)
- Click "Add secret"

**Secret #6 (OPTIONAL):**
- If you have Google Gemini API key:
  - Name: `VITE_GOOGLE_GENERATIVE_AI_API_KEY`
  - Value: (your API key)
  - Click "Add secret"

✅ **When done:** You see 5-6 secrets listed in GitHub

---

### **PART 3: CREATE GITHUB ENVIRONMENTS** ⏱️ 5 minutes

Go to: https://github.com/HarshalShah2005/blogify/settings/environments

**Create Environment #1: development**
- Click "New environment"
- Name: `development`
- Click "Configure environment"
- Click "Save protection rules"

**Create Environment #2: staging**
- Click "New environment"
- Name: `staging`
- Click "Configure environment"
- Check: "Require reviewers" → Set to `1`
- Click "Save protection rules"

**Create Environment #3: production**
- Click "New environment"
- Name: `production`
- Click "Configure environment"
- Check: "Require reviewers" → Set to `1`
- Check: "Restrict who can deploy to production"
  - Select your GitHub username (HarshalShah2005)
- Check: "Dismiss stale pull request approvals"
- Click "Save protection rules"

✅ **When done:** You see 3 environments (development, staging, production)

---

## 📋 QUICK CHECKLIST

- [ ] AWS account created
- [ ] IAM user `medium-cicd` created
- [ ] Access Key ID saved (from AWS)
- [ ] Secret Access Key saved (from AWS)
- [ ] All 5-6 secrets added to GitHub blogify repo
- [ ] 3 environments created (dev, staging, prod)

---

## ✅ VERIFY EVERYTHING

After completing all 3 parts:

1. **Check Secrets:**
   - Go to: https://github.com/HarshalShah2005/blogify/settings/secrets/actions
   - Verify you see 5-6 secrets ✅

2. **Check Environments:**
   - Go to: https://github.com/HarshalShah2005/blogify/settings/environments
   - Verify you see 3 environments ✅

3. **Check Workflows:**
   - Go to: https://github.com/HarshalShah2005/blogify/actions
   - You should see "Backend CI" and "Frontend CI" workflows
   - They should run automatically when you push to main

---

## 🚀 WHEN COMPLETE

Reply with:
```
✅ STEP 1 COMPLETE!

AWS: ✅ Credentials ready
Secrets: ✅ 5-6 secrets added to blogify repo
Environments: ✅ dev, staging, prod created
Workflows: ✅ Visible in GitHub Actions

Ready for Step 2: Docker Setup! 🐳
```

---

## ❓ NEED HELP?

If you get stuck:
1. Tell me what step you're on
2. Describe the error
3. I'll help fix it immediately!

---

## 📌 IMPORTANT LINKS

- Your Repository: https://github.com/HarshalShah2005/blogify
- Settings → Secrets: https://github.com/HarshalShah2005/blogify/settings/secrets/actions
- Settings → Environments: https://github.com/HarshalShah2005/blogify/settings/environments
- Actions Tab: https://github.com/HarshalShah2005/blogify/actions
- AWS Console: https://console.aws.amazon.com/
- AWS IAM: https://console.aws.amazon.com/iam/

