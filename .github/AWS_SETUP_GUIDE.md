# AWS Account & Credentials Setup Guide

## Step-by-Step: Get AWS Credentials

### Part 1: Create AWS Account (if you don't have one)

1. **Go to AWS Homepage**
   - Visit https://aws.amazon.com/
   - Click "Create an AWS account" (top right)

2. **Enter Email and Password**
   - Email: Use your email address
   - Password: Create a strong password
   - AWS account name: Your name or company name

3. **Add Payment Information**
   - AWS requires a valid credit card
   - Free tier includes:
     - 12 months free (most services)
     - 750 hours EC2 per month
     - 20GB storage per month
   - You won't be charged if you stay within free tier limits

4. **Verify Phone Number**
   - Enter your phone number
   - Complete SMS/phone verification

5. **Choose Support Plan**
   - Select "Basic Support (Free)" for now
   - You can upgrade later

6. **Confirmation**
   - AWS will send a confirmation email
   - Wait for account activation (usually instant)

---

### Part 2: Create IAM User for CI/CD

Best practice: Don't use your AWS root account credentials. Create a dedicated IAM user for CI/CD.

#### Steps:

1. **Sign in to AWS Console**
   - Go to https://console.aws.amazon.com
   - Sign in with your AWS account

2. **Navigate to IAM**
   - Search for "IAM" in the search bar
   - Click "IAM" service

3. **Create a New User**
   - Left sidebar → Click "Users"
   - Click "Create user" button
   - User name: `medium-cicd` (or your preference)
   - Click "Next"

4. **Set Permissions**
   - Select "Attach policies directly"
   - Search and check these policies:
     - [ ] `AmazonEC2FullAccess` (for EC2 instances)
     - [ ] `AmazonRDSFullAccess` (for database)
     - [ ] `AmazonECS_FullAccess` (for container orchestration)
     - [ ] `AmazonElastiCacheFullAccess` (optional)
     - [ ] `IAMUserSSHPublicKeyManagement` (for SSH keys)
     - [ ] `CloudFrontFullAccess` (for CDN)
     - [ ] `AmazonS3FullAccess` (for storage)
     - [ ] `EC2ContainerRegistryFullAccess` (for Docker images)
     - [ ] `CloudWatchFullAccess` (for monitoring)
     - [ ] `AWSSecretsManagerFullAccess` (for secrets management)
   - Click "Next"

5. **Review and Create**
   - Click "Create user"

6. **Create Access Keys**
   - Click on the user you just created
   - Go to "Security credentials" tab
   - Scroll to "Access keys"
   - Click "Create access key"
   - Use case: "Application running outside AWS"
   - Click "Create access key"
   - **IMPORTANT:** Copy and save these values:
     - Access Key ID
     - Secret Access Key
     - (You can only view these once!)

7. **Download Credentials**
   - Option 1: Click "Download .csv file" to save locally
   - Option 2: Copy the values to a secure location (password manager)
   - **Keep these secret!**

---

### Part 3: Set Up Cost Alerts (Recommended)

To prevent unexpected charges:

1. **Go to AWS Billing Dashboard**
   - Search for "Billing" in AWS Console
   - Click "Billing and Cost Management"

2. **Create a Budget Alert**
   - Left sidebar → "Budgets"
   - Click "Create budget"
   - Budget type: "Cost"
   - Set budget amount: $10 USD (or your preferred limit)
   - Email: Your email address
   - Threshold: Alert when 50% and 100% of budget is used

3. **Enable Cost Explorer**
   - Left sidebar → "Cost Explorer"
   - This lets you track your spending

---

### Part 4: Enable Required AWS Services

Some AWS services need to be enabled in your region. Let's verify:

1. **EC2 Service**
   - Search for "EC2"
   - Should be available in your region

2. **RDS Service**
   - Search for "RDS"
   - Should be available in your region

3. **ECR Service** (for Docker images)
   - Search for "ECR" or "Elastic Container Registry"
   - Should be available in your region

4. **S3 Service** (for storage)
   - Search for "S3"
   - Should be available in your region

5. **CloudFront Service** (for CDN)
   - Search for "CloudFront"
   - Should be available globally

---

### Part 5: Choose Your AWS Region

AWS has multiple regions worldwide. Choose one closer to your users:

**Popular Regions:**
- `us-east-1` (N. Virginia) - Default, most services
- `eu-west-1` (Ireland) - Europe
- `ap-southeast-1` (Singapore) - Asia-Pacific
- `us-west-2` (Oregon) - US West Coast

**Recommendation:** Use `us-east-1` for this setup (has best pricing and all services)

### Verify Region in Console:
- Top right corner of AWS Console shows current region
- Change it by clicking the region name

---

## Part 6: Add Credentials to GitHub

Once you have AWS credentials:

1. **Go to GitHub Secrets**
   - GitHub.com → Your repo → Settings → Secrets and variables → Actions

2. **Add AWS_ACCESS_KEY_ID**
   - Secret name: `AWS_ACCESS_KEY_ID`
   - Secret value: Your Access Key ID from step 2.6
   - Click "Add secret"

3. **Add AWS_SECRET_ACCESS_KEY**
   - Secret name: `AWS_SECRET_ACCESS_KEY`
   - Secret value: Your Secret Access Key from step 2.6
   - Click "Add secret"

4. **Add AWS_REGION**
   - Secret name: `AWS_REGION`
   - Secret value: `us-east-1`
   - Click "Add secret"

---

## Part 7: Test AWS Credentials (Optional)

To verify your credentials work, you can test them locally:

### Windows PowerShell:
```powershell
# Set environment variables
$env:AWS_ACCESS_KEY_ID = "YOUR_ACCESS_KEY"
$env:AWS_SECRET_ACCESS_KEY = "YOUR_SECRET_KEY"
$env:AWS_REGION = "us-east-1"

# Install AWS CLI
choco install awscli  # if you have Chocolatey
# Or download from: https://aws.amazon.com/cli/

# Test connection
aws sts get-caller-identity
```

Expected output:
```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/medium-cicd"
}
```

### macOS/Linux:
```bash
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_KEY"
export AWS_REGION="us-east-1"

# Install AWS CLI
brew install awscli  # macOS
# or apt-get install awscli  # Linux

# Test connection
aws sts get-caller-identity
```

---

## Security Best Practices

✅ **DO:**
- [ ] Use IAM user instead of root account
- [ ] Store credentials in AWS Secrets Manager (we'll do this later)
- [ ] Rotate credentials every 90 days
- [ ] Use AWS MFA (multi-factor authentication)
- [ ] Restrict IAM user permissions to only what's needed
- [ ] Store credentials securely (password manager)
- [ ] Enable CloudTrail for audit logging

❌ **DON'T:**
- [ ] Share credentials via email or messages
- [ ] Commit credentials to GitHub
- [ ] Use the same credentials for multiple projects
- [ ] Store credentials in plain text files
- [ ] Log credentials in CI/CD logs
- [ ] Use root account access keys

---

## Troubleshooting AWS Setup

| Problem | Solution |
|---------|----------|
| **"Access Denied" error** | Check IAM user permissions. Add required policies. |
| **Service not available in region** | Some services aren't available in all regions. Switch to us-east-1. |
| **Credentials not working locally** | Verify credentials are copied correctly. Check for extra spaces. |
| **Budget alerts not sending** | Verify email address is correct. Check spam folder. |
| **Can't create IAM user** | You may need root account permissions. Check your IAM policy. |

---

## Next Steps

1. ✅ Create AWS account
2. ✅ Create IAM user and generate access keys
3. ✅ Add credentials to GitHub Secrets
4. ✅ Enable cost alerts
5. ✅ Choose your region (`us-east-1` recommended)
6. Continue with **Step 1 Checklist** → **Step 2: Docker Setup**

---

## Quick Reference

| Item | Value |
|------|-------|
| AWS Console URL | https://console.aws.amazon.com |
| IAM Users | https://console.aws.amazon.com/iam/home#/users/ |
| EC2 Dashboard | https://console.aws.amazon.com/ec2/ |
| RDS Dashboard | https://console.aws.amazon.com/rds/ |
| Billing Dashboard | https://console.aws.amazon.com/billing/ |
| Your Region | us-east-1 (recommended) |
| Account ID | Available after creating IAM user |

