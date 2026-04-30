# Jenkins + GitHub Integration Guide 🔗

## Overview
This guide walks through integrating your GitHub repository with Jenkins for automated CI/CD pipeline execution.

---

## Part 1: Install Required Jenkins Plugins

Jenkins needs plugins to work with GitHub. Do this FIRST:

1. Open Jenkins Dashboard: `http://localhost:8080` (or your Jenkins URL)
2. Click **Manage Jenkins** → **Manage Plugins**
3. Go to **Available plugins** tab
4. Search for and install these plugins:
   - **GitHub plugin**
   - **GitHub API Plugin**
   - **Pipeline plugin** (usually pre-installed)
   - **Docker Pipeline** (optional, for Docker support)
   - **Git plugin** (usually pre-installed)

5. Click **Install without restart**
6. Check **Restart Jenkins when installation is complete**
7. Wait for Jenkins to restart

---

## Part 2: Create GitHub Personal Access Token

Jenkins needs permission to access your GitHub repository. Create a token:

1. Go to GitHub: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. **Token name**: `Jenkins-Blogify` (or similar)
4. **Expiration**: 90 days (or as needed)
5. **Select scopes**:
   - ✅ `repo` (full control of private repositories)
   - ✅ `admin:repo_hook` (write access to hooks)
   - ✅ `admin:org_hook` (admin access to org hooks - if applicable)
   - ✅ `user:email` (access to user profile data)

6. Click **Generate token**
7. **COPY THE TOKEN** - You won't see it again!

---

## Part 3: Configure GitHub Credentials in Jenkins

1. Go to Jenkins Dashboard: `http://localhost:8080`
2. Click **Manage Jenkins** → **Manage Credentials**
3. Click **Jenkins** (under Stores scoped to Jenkins)
4. Click **Global credentials (unrestricted)** (left sidebar)
5. Click **Add Credentials** (left sidebar)

**Fill in the form:**
   - **Kind**: Username with password
   - **Username**: Your GitHub username (e.g., `HarshalShah2005`)
   - **Password**: Paste your GitHub Personal Access Token
   - **ID**: `github-credentials` (important! use this exact ID)
   - **Description**: GitHub Credentials for Blogify

6. Click **Create**

---

## Part 4: Create a New Jenkins Job

### Option A: Declarative Pipeline Job (Recommended)

1. Jenkins Dashboard → **New Item**
2. **Item name**: `blogify-pipeline` (or similar)
3. Select: **Pipeline**
4. Click **OK**

**Configure the job:**

5. **General** tab:
   - Check: **GitHub project**
   - **Project url**: `https://github.com/HarshalShah2005/blogify`

6. **Build Triggers** tab:
   - ✅ Check **GitHub hook trigger for GITScm polling**
   - ✅ Check **Poll SCM** (as backup)
   - **Schedule**: Leave empty (or use `H/5 * * * *` to poll every 5 minutes)

7. **Pipeline** tab:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repositories**:
     - **Repository URL**: `https://github.com/HarshalShah2005/blogify.git`
     - **Credentials**: Select `github-credentials` (the one you created)
   - **Branches to build**:
     - **Branch Specifier**: `*/main` (or your default branch)
   - **Script Path**: `Jenkinsfile` (path to your Jenkinsfile in repo)

8. Click **Save**

---

## Part 5: Set Up GitHub Webhook

This allows GitHub to automatically trigger Jenkins builds when you push code.

### On GitHub:

1. Go to your repository: https://github.com/HarshalShah2005/blogify
2. Settings → **Webhooks**
3. Click **Add webhook**

**Fill in:**
   - **Payload URL**: `http://<YOUR_JENKINS_URL>/github-webhook/`
     - Example: `http://192.168.1.100:8080/github-webhook/`
     - Example: `http://jenkins.example.com/github-webhook/`
     - ⚠️ **Important**: The URL must be accessible from the internet OR GitHub must reach your Jenkins server
   - **Content type**: `application/json`
   - **Events**: Select **Just the push event** (or customize as needed)
   - **Active**: ✅ Check this

4. Click **Add webhook**

**Test the webhook:**
   - GitHub will show you recent deliveries
   - You should see a green checkmark (✅) if successful
   - Red ❌ means GitHub couldn't reach your Jenkins server

### If You See "Failed Delivery":

If GitHub can't reach your Jenkins:

**Option 1: Use Poll SCM (Fallback)**
- Jenkins will periodically check GitHub for changes
- Less efficient, but works without webhook

**Option 2: Open Firewall (if Jenkins is local)**
- Expose Jenkins to the internet (use ngrok or port forwarding)
- Example with ngrok: `ngrok http 8080`
- Update webhook URL to ngrok URL

**Option 3: Use Jenkins behind a proxy**
- If Jenkins is behind a firewall, configure a reverse proxy (nginx/Apache)

---

## Part 6: Test the Integration

### Manual Trigger:

1. Jenkins Dashboard → Select `blogify-pipeline` job
2. Click **Build Now**
3. Check **Build History** → Click on the build
4. View **Console Output** to see logs

### Automated Trigger (via GitHub):

1. Make a change to your GitHub repository
2. Push to your default branch:
   ```bash
   git add .
   git commit -m "Test Jenkins integration"
   git push origin main
   ```
3. Watch Jenkins Dashboard - it should automatically start a build
4. Check the build logs

---

## Part 7: Configure Environment Variables (Optional but Recommended)

If your pipeline needs environment variables (e.g., API keys, database credentials):

1. Jenkins Dashboard → Manage Jenkins → **Configure System**
2. Scroll to **Global properties**
3. Check: **Environment variables**
4. Add variables:
   - `DATABASE_URL`: Your database connection string
   - `API_KEY`: Any API keys needed
   - `GITHUB_TOKEN`: (if needed in your pipeline)

OR set them in your Jenkins job:

1. Job configuration → **Build Environment**
2. Check: **Inject environment variables**
3. Add your variables

---

## Part 8: Troubleshooting

### Issue 1: "Failed to connect to GitHub"
**Solution:**
- Check GitHub credentials in Jenkins → Manage Credentials
- Verify Personal Access Token is still valid and not expired
- Ensure token has correct scopes (`repo`, `admin:repo_hook`)

### Issue 2: "Permission denied" when cloning
**Solution:**
- Use HTTPS with token-based auth (recommended)
- Or configure SSH keys in Jenkins

### Issue 3: Webhook not triggering builds
**Solution:**
- Check webhook in GitHub repository settings
- Verify Jenkins URL is reachable from GitHub
- Enable **Poll SCM** as a fallback

### Issue 4: Docker commands fail in pipeline
**Solution:**
- Jenkins user needs Docker permissions:
  ```bash
  sudo usermod -aG docker jenkins
  sudo systemctl restart jenkins
  ```

### Issue 5: "docker-compose not found"
**Solution:**
- Install Docker Compose on Jenkins server:
  ```bash
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  ```

---

## Part 9: Current Jenkinsfile Overview

Your `Jenkinsfile` currently does:

1. **Checkout** - Pulls code from GitHub
2. **Stop Previous Containers** - Cleans up old Docker containers
3. **Build** - Builds Docker images using `docker-compose build`
4. **Deploy** - Starts containers with `docker-compose up -d`
5. **Health Check** - Verifies services are running
6. **Post Actions** - Logs deployment details

This is a good starting point! You can enhance it with:
- Tests (lint, unit tests)
- Security scanning
- Notifications (Slack, email)
- Artifact archiving
- Deployment to AWS ECS

---

## Part 10: Next Steps (Optional Enhancements)

### Add Testing to Pipeline
```groovy
stage('Test') {
    steps {
        sh 'npm install'
        sh 'npm test'
    }
}
```

### Add Notifications
```groovy
post {
    success {
        // Send Slack message, email, etc.
    }
    failure {
        // Notify on failure
    }
}
```

### Deploy to AWS ECS
Replace `docker-compose up` with ECS deployment steps

### Add Security Scanning
```groovy
stage('Security Scan') {
    steps {
        sh 'trivy image <your-image>'
    }
}
```

---

## Summary

✅ Install Jenkins plugins  
✅ Create GitHub Personal Access Token  
✅ Configure credentials in Jenkins  
✅ Create Pipeline job  
✅ Set up GitHub webhook  
✅ Test the integration  
✅ Monitor builds in Jenkins Dashboard  

You're now ready for automated CI/CD! 🚀
