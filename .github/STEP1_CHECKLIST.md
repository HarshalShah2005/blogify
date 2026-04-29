# Step 1: Complete Setup Checklist

## Before You Start
- [ ] Your project code is already in a GitHub repository (verified ✓)
- [ ] You have an AWS account with appropriate permissions
- [ ] You have a Docker Hub account (optional)

---

## Checklist: GitHub Repository Setup

### Phase 1: GitHub Repository
- [ ] **A1:** Visit https://github.com/new and create a new repository named `medium`
- [ ] **A2:** Make it Private (recommended for security)
- [ ] **A3:** Don't initialize with README
- [ ] **A4:** Copy the repository URL (e.g., https://github.com/your-username/medium.git)
- [ ] **A5:** Run in your project directory:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/medium.git
  git branch -M main
  git push -u origin main
  ```
- [ ] **A6:** Refresh GitHub and verify you see backend/ and frontend/ folders

---

### Phase 2: AWS Credentials Setup
- [ ] **B1:** Go to AWS Console → IAM → Users → Your user
- [ ] **B2:** Click "Security credentials" tab
- [ ] **B3:** Scroll to "Access keys" section
- [ ] **B4:** Click "Create access key"
  - Use case: "Application running outside AWS"
  - Click "Create access key"
- [ ] **B5:** Copy:
  - Access Key ID
  - Secret Access Key
  - **Save these securely** (you can only view once)

---

### Phase 3: GitHub Secrets Configuration
- [ ] **C1:** Go to https://github.com/YOUR_USERNAME/medium/settings/secrets/actions
- [ ] **C2:** Add these secrets one by one:

#### AWS Secrets (Required)
- [ ] `AWS_ACCESS_KEY_ID` = your-access-key-id
- [ ] `AWS_SECRET_ACCESS_KEY` = your-secret-access-key
- [ ] `AWS_REGION` = `us-east-1` (or your preferred region)

#### Application Secrets (Required)
- [ ] `DATABASE_URL` = `postgresql://user:password@localhost:5432/medium` (placeholder for now)
- [ ] `JWT_SECRET` = generate with: `openssl rand -hex 32`

#### Optional Secrets
- [ ] `VITE_GOOGLE_GENERATIVE_AI_API_KEY` = your-gemini-api-key (if you have it)
- [ ] `DOCKER_USERNAME` = your-docker-hub-username
- [ ] `DOCKER_PASSWORD` = your-docker-hub-token

---

### Phase 4: GitHub Environments Setup
- [ ] **D1:** Go to https://github.com/YOUR_USERNAME/medium/settings/environments
- [ ] **D2:** Create "development" environment
- [ ] **D3:** Create "staging" environment with 1 reviewer required
- [ ] **D4:** Create "production" environment with:
  - [ ] 1 reviewer required
  - [ ] Only you can deploy
  - [ ] Dismiss stale approvals enabled

---

### Phase 5: Branch Protection Rules
- [ ] **E1:** Go to https://github.com/YOUR_USERNAME/medium/settings/branches
- [ ] **E2:** Click "Add rule"
- [ ] **E3:** Branch name pattern: `main`
- [ ] **E4:** Enable:
  - [ ] Require pull request reviews before merging (1 reviewer)
  - [ ] Require status checks to pass before merging
  - [ ] Require branches to be up to date before merging
  - [ ] Dismiss stale pull request approvals when new commits are pushed

---

### Phase 6: GitHub Actions Permissions
- [ ] **F1:** Go to https://github.com/YOUR_USERNAME/medium/settings/actions/general
- [ ] **F2:** Set "Actions permissions" to "Allow all actions and reusable workflows"
- [ ] **F3:** Set "Workflow permissions" to:
  - [ ] Read and write permissions
  - [ ] Allow GitHub Actions to create and approve pull requests

---

### Phase 7: Verify Workflow Files
- [ ] **G1:** Check that `.github/workflows/` directory exists locally
- [ ] **G2:** Confirm these files exist:
  - [ ] `01-backend-ci.yml`
  - [ ] `02-frontend-ci.yml`
  - [ ] (Additional files will be created in Steps 3-5)
- [ ] **G3:** Push workflow files to GitHub:
  ```bash
  git add .github/
  git commit -m "Add GitHub Actions CI/CD workflow files"
  git push origin main
  ```

---

## Verification Steps

### Local Verification
Run these commands to ensure your setup is correct:

```bash
# 1. Verify git remote is set correctly
git remote -v

# 2. Verify you're on main branch
git branch

# 3. Check if .github directory exists
ls -la .github/

# 4. Verify GitHub Actions files
ls -la .github/workflows/
```

### GitHub Verification
1. Go to https://github.com/YOUR_USERNAME/medium
2. Click "Settings"
3. Verify:
   - [ ] Repository name is correct
   - [ ] Visibility is Private (or your preference)
4. Click "Secrets and variables → Actions"
5. Verify all 6+ secrets are listed
6. Click "Environments"
7. Verify development, staging, and production exist
8. Click "Branches"
9. Verify "main" branch protection rule exists
10. Click "Actions"
11. Verify no workflow errors appear

---

## Test the Setup

### Test 1: Simple Push
1. Make a small change (e.g., add a comment to README)
2. Push to main: `git push origin main`
3. Go to GitHub and watch the Actions tab
4. You should see workflow runs starting (they may fail initially - that's OK)

### Test 2: Pull Request
1. Create a feature branch: `git checkout -b test-pr`
2. Make a small change
3. Push and create a PR: `git push origin test-pr`
4. Go to GitHub and create Pull Request
5. You should see status checks running
6. Main branch should require approval before merging

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Secrets not found in workflow** | Wait 5 minutes after adding secrets. GitHub needs time to sync. |
| **Git push rejected** | Ensure branch protection allows your push (or push to feature branch) |
| **Workflow not triggering** | Check that `.github/workflows/*.yml` files exist and are valid YAML |
| **AWS credentials error** | Verify Access Key ID and Secret Access Key are correct in GitHub Secrets |
| **Database URL error** | Use a placeholder for now; we'll set up RDS in Step 6 |

---

## What's Next?

✅ When you've completed all items above:
1. Reply with a confirmation message
2. Share any errors you encounter
3. I'll verify your setup and we'll move to **Step 2: Docker Setup**

---

## Quick Reference: Important Links

- GitHub Repository: https://github.com/YOUR_USERNAME/medium
- GitHub Secrets: https://github.com/YOUR_USERNAME/medium/settings/secrets/actions
- GitHub Environments: https://github.com/YOUR_USERNAME/medium/settings/environments
- AWS IAM: https://console.aws.amazon.com/iam/
- AWS EC2: https://console.aws.amazon.com/ec2/
- AWS RDS: https://console.aws.amazon.com/rds/

---

## Helpful Commands

```bash
# Generate a strong JWT_SECRET
openssl rand -hex 32

# Generate a strong password
openssl rand -base64 32

# Check git remote
git remote -v

# View git configuration
git config --list

# Push changes
git add .github/
git commit -m "Add CI/CD GitHub Actions setup"
git push origin main
```

