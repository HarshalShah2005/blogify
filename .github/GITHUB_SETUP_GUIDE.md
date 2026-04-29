# Step 1: GitHub Repository Setup Guide

## Overview
This guide helps you configure GitHub, GitHub Actions, AWS credentials, and deployment environments for the CI/CD pipeline.

---

## Part A: Create GitHub Repository

### If you don't have a GitHub repository yet:

1. **Create a new repository on GitHub.com**
   - Go to https://github.com/new
   - Repository name: `medium` (or your preferred name)
   - Description: "Full-stack blogging platform with AI features and CI/CD pipeline"
   - Visibility: Private (recommended)
   - Do NOT initialize with README (your code is already ready)

2. **Connect your local repository to GitHub**
   ```bash
   # In your project root directory
   git remote add origin https://github.com/YOUR_USERNAME/medium.git
   git branch -M main
   git push -u origin main
   ```

3. **Verify the push was successful**
   - Visit your GitHub repository URL
   - Confirm you see the backend/ and frontend/ folders

---

## Part B: Configure GitHub Secrets (AWS & Database Credentials)

GitHub Secrets are environment variables securely stored and injected into your CI/CD workflows.

### Steps to Add Secrets:

1. **Go to Repository Settings**
   - Navigate to: `https://github.com/YOUR_USERNAME/medium/settings/secrets/actions`
   - Or: Repository → Settings → Secrets and variables → Actions

2. **Add the following secrets** (click "New repository secret" for each):

#### AWS Credentials
```
Secret Name: AWS_ACCESS_KEY_ID
Value: Your AWS Access Key ID
```

```
Secret Name: AWS_SECRET_ACCESS_KEY
Value: Your AWS Secret Access Key
```

```
Secret Name: AWS_REGION
Value: us-east-1  (or your preferred region)
```

#### Database & Application Secrets
```
Secret Name: DATABASE_URL
Value: postgresql://user:password@host:5432/medium-db
       (You can use a placeholder for now, we'll set up RDS in Step 6)
```

```
Secret Name: JWT_SECRET
Value: your-super-secret-jwt-key-minimum-32-characters-long
       (Generate a strong random string)
```

```
Secret Name: DOCKER_USERNAME
Value: Your Docker Hub username (optional, for future Docker Hub publishing)
```

```
Secret Name: DOCKER_PASSWORD
Value: Your Docker Hub token (optional)
```

#### Google Gemini API (for AI features)
```
Secret Name: VITE_GOOGLE_GENERATIVE_AI_API_KEY
Value: Your Google Gemini API key
```

### Example of adding a secret:
- Click "New repository secret"
- Name: `AWS_ACCESS_KEY_ID`
- Value: `AKIAIOSFODNN7EXAMPLE`
- Click "Add secret"

---

## Part C: Configure Deployment Environments

GitHub Environments allow you to set environment-specific secrets and protection rules.

### Steps to Create Environments:

1. **Go to Repository Environments**
   - Navigate to: `https://github.com/YOUR_USERNAME/medium/settings/environments`
   - Or: Repository → Settings → Environments

2. **Create Development Environment**
   - Click "New environment"
   - Name: `development`
   - Click "Configure environment"
   - Add secrets (optional overrides):
     - DATABASE_URL (dev database)
     - JWT_SECRET (dev secret)

3. **Create Staging Environment**
   - Name: `staging`
   - Add secrets:
     - DATABASE_URL (staging database)
     - JWT_SECRET (staging secret)
   - Add protection rules:
     - ✓ Require reviewers: 1 person
     - ✓ Dismiss stale pull request approvals

4. **Create Production Environment**
   - Name: `production`
   - Add secrets:
     - DATABASE_URL (production database - RDS)
     - JWT_SECRET (production secret)
   - Add protection rules:
     - ✓ Require reviewers: 1 person
     - ✓ Restrict who can deploy to production: Select your GitHub account
     - ✓ Dismiss stale pull request approvals

---

## Part D: Set Up Branch Protection Rules

Branch protection ensures code quality before merging.

### Steps:

1. **Go to Repository Settings**
   - Repository → Settings → Branches

2. **Add Branch Protection Rule**
   - Click "Add rule"
   - Branch name pattern: `main`
   - Enable the following:
     - ✓ Require pull request reviews before merging (1 reviewer)
     - ✓ Require status checks to pass before merging
     - ✓ Require branches to be up to date before merging
     - ✓ Include administrators in restrictions

3. **Configure Status Checks**
   - Once CI/CD workflows run, return here and select:
     - ✓ Backend CI
     - ✓ Frontend CI
     - ✓ Security Checks (optional)

---

## Part E: Configure GitHub Actions Permissions

### Steps:

1. **Go to Actions Settings**
   - Repository → Settings → Actions → General

2. **Configure Permissions**
   - Actions permissions: "Allow all actions and reusable workflows"
   - Workflow permissions: 
     - ✓ Read and write permissions
     - ✓ Allow GitHub Actions to create and approve pull requests

3. **Configure Runners**
   - Runners: Use "Default GitHub-hosted runners (Ubuntu latest)"
   - No need for self-hosted runners initially

---

## Part F: Add GitHub Actions Workflow Files

Workflow files (YAML) are already created in `.github/workflows/`:

- `01-backend-ci.yml` - Backend testing & linting
- `02-frontend-ci.yml` - Frontend testing & linting
- `03-backend-docker-push.yml` - Build & push backend Docker image to ECR
- `04-frontend-docker-push.yml` - Build & push frontend Docker image to S3
- (More workflows will be added in Steps 4-9)

These will be automatically triggered on:
- Push to `main` branch
- Pull requests to `main` branch
- Manual triggers (workflow_dispatch)

---

## Part G: Create GitHub Personal Access Token (Optional, for Advanced Setup)

If you need to trigger workflows from Jenkins or external tools:

1. **Go to GitHub Settings**
   - GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Create a new token**
   - Name: `jenkins-ci-token`
   - Expiration: 90 days
   - Scopes:
     - ✓ repo (full control of private repositories)
     - ✓ workflow (update GitHub Actions workflows)
   - Click "Generate token"
   - **Save the token securely** (you'll use it in Step 13 for Jenkins)

---

## Verification Checklist

After completing all parts, verify:

- [ ] GitHub repository is created and code is pushed
- [ ] All secrets are added to GitHub (Settings → Secrets → Actions)
- [ ] Development, Staging, and Production environments are created
- [ ] Branch protection rules are set for `main` branch
- [ ] GitHub Actions permissions are configured
- [ ] Workflow files exist in `.github/workflows/`

---

## Next Steps

Once you've completed this setup:
1. Confirm all secrets are added
2. Push any changes to GitHub
3. We'll create the Docker setup in **Step 2**

---

## Troubleshooting

**Q: How do I get AWS credentials?**
- A: Go to AWS IAM console → Users → Your user → Security credentials → Create access key

**Q: What if I don't have an AWS account?**
- A: Create one at https://aws.amazon.com/free/ (includes 12-month free tier)

**Q: Can I test the setup without AWS?**
- A: Yes! In Step 2, we'll use Docker locally to test everything before pushing to AWS.

---

## Security Best Practices

✅ DO:
- Use strong, random JWT_SECRET (32+ characters)
- Rotate AWS credentials regularly
- Use GitHub Secrets for all sensitive data
- Enable branch protection on main
- Review pull requests before merging

❌ DON'T:
- Commit secrets to the repository
- Share secrets in pull requests or comments
- Use the same secret across environments
- Store credentials in code or configuration files

