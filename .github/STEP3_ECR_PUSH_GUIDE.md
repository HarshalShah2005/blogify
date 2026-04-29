# STEP 3: DOCKER ECR PUSH WORKFLOWS 🐳→☁️

## Overview

This step sets up **GitHub Actions** to automatically:
- Build Docker images when you push to `main`
- Push images to **AWS ECR** (Elastic Container Registry)
- Make images available for AWS deployment

---

## What You'll Have After This Step

✅ Two AWS ECR repositories (backend + frontend)
✅ GitHub Actions workflow for backend image build & push
✅ GitHub Actions workflow for frontend image build & push
✅ Automatic Docker image deployment on every commit
✅ Ready for AWS ECS/EC2 deployment

---

## Part 1: Create AWS ECR Repositories

### Step 1.1: Create Backend ECR Repository

```bash
aws ecr create-repository \
  --repository-name blogify-backend \
  --region us-east-1
```

**Save the output repository URI** (looks like: `123456789.dkr.ecr.us-east-1.amazonaws.com/blogify-backend`)

### Step 1.2: Create Frontend ECR Repository

```bash
aws ecr create-repository \
  --repository-name blogify-frontend \
  --region us-east-1
```

**Save the output repository URI**

---

## Part 2: Add AWS Account ID to GitHub Secrets

Add your **AWS Account ID** to GitHub Secrets:

1. Go to: https://github.com/HarshalShah2005/blogify/settings/secrets/actions
2. Click **New repository secret**
3. Name: `AWS_ACCOUNT_ID`
4. Value: Your 12-digit AWS Account ID (find at: https://console.aws.amazon.com/iam/home?#/security_credentials)
5. Click **Add secret**

✅ **When done:** `AWS_ACCOUNT_ID` is in GitHub Secrets

---

## Part 3: Create GitHub Actions Workflows

### Step 3.1: Backend Push Workflow

Create file: `.github/workflows/03-backend-push-ecr.yml`

```yaml
name: Build & Push Backend to ECR

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
      - '.github/workflows/03-backend-push-ecr.yml'
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: blogify-backend
  IMAGE_TAG: ${{ github.sha }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      id-token: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build, tag, and push backend image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          docker build -f backend/Dockerfile -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Create deployment summary
        if: always()
        run: |
          echo "## Backend Image Pushed to ECR" >> $GITHUB_STEP_SUMMARY
          echo "- **Repository**: blogify-backend" >> $GITHUB_STEP_SUMMARY
          echo "- **Tag**: ${{ env.IMAGE_TAG }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Latest**: pushed" >> $GITHUB_STEP_SUMMARY
```

### Step 3.2: Frontend Push Workflow

Create file: `.github/workflows/04-frontend-push-ecr.yml`

```yaml
name: Build & Push Frontend to ECR

on:
  push:
    branches:
      - main
    paths:
      - 'frontend/**'
      - '.github/workflows/04-frontend-push-ecr.yml'
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: blogify-frontend
  IMAGE_TAG: ${{ github.sha }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      id-token: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build, tag, and push frontend image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          docker build -f frontend/Dockerfile -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Create deployment summary
        if: always()
        run: |
          echo "## Frontend Image Pushed to ECR" >> $GITHUB_STEP_SUMMARY
          echo "- **Repository**: blogify-frontend" >> $GITHUB_STEP_SUMMARY
          echo "- **Tag**: ${{ env.IMAGE_TAG }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Latest**: pushed" >> $GITHUB_STEP_SUMMARY
```

---

## Part 4: Test the Workflows

### Step 4.1: Trigger Backend Workflow

Push a small change to backend:

```powershell
cd "C:\Users\Harshal Shah\Documents\Coding\WebDev\projects\medium"
git add -A && git commit -m "Trigger backend ECR push workflow" && git push origin main
```

Watch the workflow:
1. Go to: https://github.com/HarshalShah2005/blogify/actions
2. Click **Build & Push Backend to ECR**
3. Wait for completion (5-10 minutes)

### Step 4.2: Verify in AWS ECR

```bash
aws ecr describe-images --repository-name blogify-backend --region us-east-1
```

You should see images with tags: `latest` and the commit SHA

### Step 4.3: Trigger Frontend Workflow

Push a frontend change:

```powershell
cd "C:\Users\Harshal Shah\Documents\Coding\WebDev\projects\medium"
touch frontend/test.txt
git add frontend/test.txt && git commit -m "Trigger frontend ECR push workflow" && git push origin main
```

Watch it complete, then clean up:

```powershell
git rm frontend/test.txt && git commit -m "Clean up test file" && git push origin main
```

---

## Part 5: Verify Images in ECR

### List Backend Images

```bash
aws ecr describe-images \
  --repository-name blogify-backend \
  --region us-east-1 \
  --query 'imageDetails[*].[imageTags,imageSizeInBytes,imagePushedAt]' \
  --output table
```

### List Frontend Images

```bash
aws ecr describe-images \
  --repository-name blogify-frontend \
  --region us-east-1 \
  --query 'imageDetails[*].[imageTags,imageSizeInBytes,imagePushedAt]' \
  --output table
```

You should see entries with:
- Tags: `["latest", "sha123456..."]`
- Size: ~130MB (backend), ~45MB (frontend)
- Pushed timestamp: recent

---

## 📁 Files Created in This Step

```
.github/
└── workflows/
    ├── 03-backend-push-ecr.yml
    ├── 04-frontend-push-ecr.yml
    └── STEP3_ECR_PUSH_GUIDE.md (this file)
```

---

## 🚀 Next: Step 4+

When images are in ECR:

**Step 4**: AWS Infrastructure
- Create RDS PostgreSQL database
- Create ECS cluster or EC2 instances
- Create security groups & IAM roles

**Step 5**: Deploy to AWS
- Deploy backend to ECS/EC2
- Deploy frontend to S3 + CloudFront
- Set up database migrations

**Step 6**: Monitoring & Domain
- Set up CloudWatch logging
- Configure custom domain (Route 53)
- Set up auto-scaling

---

## ✅ STEP 3 COMPLETE CHECKLIST

- [ ] ECR repositories created (backend + frontend)
- [ ] GitHub Actions workflows created
- [ ] `AWS_ACCOUNT_ID` added to GitHub Secrets
- [ ] Backend image pushed to ECR
- [ ] Frontend image pushed to ECR
- [ ] Verified images in AWS console

---

## 📞 Need Help?

If stuck:
1. Check GitHub Actions logs: https://github.com/HarshalShah2005/blogify/actions
2. Verify AWS credentials in GitHub Secrets
3. Ensure ECR repositories exist in us-east-1
4. Check IAM permissions for `AWS_ACCESS_KEY_ID` user

---

## When You're Done

Reply with:
```
✅ STEP 3 COMPLETE!

ECR: ✅ Backend & Frontend repositories created
Workflows: ✅ Push to ECR automated
Images: ✅ Successfully pushed to ECR
Ready: ✅ For AWS deployment

Ready for Step 4: AWS Infrastructure! 🚀
```
