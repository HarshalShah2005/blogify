# Jenkins + GitHub Integration - EXACT STEP-BY-STEP GUIDE 🎯

## Prerequisites
- ✅ Jenkins installed and running on `http://localhost:8080`
- ✅ GitHub repository: https://github.com/HarshalShah2005/blogify
- ✅ Docker and Docker Compose installed on Jenkins machine

---

# STEP 1: INSTALL JENKINS PLUGINS

### Steps:

1. **Open Jenkins Dashboard**
   - Open browser and go to: `http://localhost:8080`
   - You should see Jenkins homepage

2. **Go to Manage Jenkins**
   - Click on **"Manage Jenkins"** (left sidebar or top menu)

3. **Open Manage Plugins**
   - Click on **"Manage Plugins"** (or "Plugin Manager")

4. **Go to Available Plugins Tab**
   - Click on **"Available plugins"** tab at the top

5. **Install GitHub Plugin**
   - In the **search box**, type: `github`
   - Find **"GitHub plugin"** in the results
   - ✅ Check the checkbox next to it
   - Scroll down and find **"GitHub API Plugin"**
   - ✅ Check the checkbox next to it

6. **Install Docker Pipeline (Optional)**
   - Search for: `docker`
   - Find **"Docker Pipeline"**
   - ✅ Check the checkbox next to it

7. **Install Plugins**
   - Click **"Install without restart"** button (bottom right)
   - Wait for installation to complete (green checkmarks appear)

8. **Restart Jenkins**
   - Check the box: **"Restart Jenkins when installation is complete and no jobs are running"**
   - Jenkins will restart automatically (takes ~30 seconds)

✅ **STEP 1 COMPLETE**

---

# STEP 2: CREATE GITHUB PERSONAL ACCESS TOKEN

### Steps:

1. **Go to GitHub Settings**
   - Open: https://github.com/settings/tokens

2. **Generate New Token**
   - Click **"Generate new token"**
   - Select **"Generate new token (classic)"** (if prompted)

3. **Fill Token Details**
   - **Token name**: Type `Jenkins-Blogify`
   - **Expiration**: Select `90 days` (or longer)

4. **Select Scopes (IMPORTANT)**
   - Scroll down to see checkboxes
   - ✅ Check **`repo`** (gives access to public and private repositories)
   - ✅ Check **`admin:repo_hook`** (allows managing webhooks)
   - Other scopes can remain unchecked

5. **Generate Token**
   - Scroll to bottom
   - Click **"Generate token"** button

6. **COPY THE TOKEN IMMEDIATELY**
   - You will see a green box with your token
   - Click the **copy icon** next to the token
   - **SAVE IT SOMEWHERE SAFE** - You won't see it again!

✅ **STEP 2 COMPLETE**

---

# STEP 3: ADD GITHUB CREDENTIALS TO JENKINS

### Steps:

1. **Open Jenkins Dashboard**
   - Go to: `http://localhost:8080`
   - Jenkins should be restarted by now

2. **Go to Manage Jenkins**
   - Click on **"Manage Jenkins"** (left sidebar)

3. **Go to Credentials**
   - Click on **"Manage Credentials"**

4. **Select Jenkins Store**
   - You'll see a list of credential stores
   - Click on **"Jenkins"** (the one with the Jenkins icon)

5. **Select Global Credentials**
   - On the left sidebar, click **"Global credentials (unrestricted)"**

6. **Add New Credentials**
   - Click **"+ Add Credentials"** (left sidebar) or **"New credentials"** button

7. **Fill in Credential Form**
   - **Kind**: Click dropdown → Select **"Username with password"**
   - **Username**: Type your GitHub username (e.g., `HarshalShah2005`)
   - **Password**: Paste the token you copied in STEP 2
   - **ID**: Type `github-credentials` (IMPORTANT - use exactly this)
   - **Description**: Type `GitHub Credentials for Blogify`

8. **Create Credentials**
   - Click **"Create"** button

✅ **STEP 3 COMPLETE**

---

# STEP 4: CREATE JENKINS PIPELINE JOB

### Steps:

1. **Go to Jenkins Home**
   - Click **"Dashboard"** or logo at top-left

2. **Create New Job**
   - Click **"+ New Item"** (left sidebar) or **"New Job"** button

3. **Enter Job Name**
   - **Item name**: Type `blogify-pipeline`

4. **Select Job Type**
   - Select **"Pipeline"** (scroll down to find it)
   - Click **"OK"**

5. **Configure General Settings**
   - **Description** (optional): Type `Automated CI/CD pipeline for Blogify`
   - ✅ Check **"GitHub project"**
   - **Project url**: Paste `https://github.com/HarshalShah2005/blogify`

6. **Configure Build Triggers**
   - Scroll down to **"Build Triggers"** section
   - ✅ Check **"GitHub hook trigger for GITScm polling"**
   - ✅ Check **"Poll SCM"** (as backup)
   - **Schedule**: Leave empty (or paste `H/5 * * * *` for 5-minute polling)

7. **Configure Pipeline**
   - Scroll down to **"Pipeline"** section
   - **Definition**: Click dropdown → Select **"Pipeline script from SCM"**

8. **Configure SCM (Source Control Management)**
   - **SCM**: Click dropdown → Select **"Git"**
   - **Repository URL**: Paste `https://github.com/HarshalShah2005/blogify.git`
   - **Credentials**: Click dropdown → Select **"github-credentials"** (the one you created in STEP 3)
   - **Branches to build** → **Branch Specifier**: Change to `*/main` (if your default branch is `main`)
   - **Script Path**: Type `Jenkinsfile` (this is the file in your repo root)

9. **Save Job**
   - Click **"Save"** button (bottom right)

✅ **STEP 4 COMPLETE**

---

# STEP 5: SET UP GITHUB WEBHOOK

### Steps:

1. **Go to GitHub Repository**
   - Open: https://github.com/HarshalShah2005/blogify

2. **Go to Repository Settings**
   - Click **"Settings"** (top menu of repo)

3. **Open Webhooks**
   - Left sidebar → Click **"Webhooks"**

4. **Add New Webhook**
   - Click **"Add webhook"** button

5. **Fill Webhook Details**
   - **Payload URL**: Type the webhook address
     - If Jenkins is local: `http://192.168.x.x:8080/github-webhook/` (replace with your actual IP)
     - If Jenkins is on localhost: `http://localhost:8080/github-webhook/`
     - ⚠️ **IMPORTANT**: GitHub must be able to reach this URL. If on localhost, you need port forwarding or ngrok
   
   - **Content type**: Click dropdown → Select **"application/json"**
   - **Which events would you like to trigger this webhook?**: Select **"Just the push event"**
   - ✅ Make sure **"Active"** is checked

6. **Save Webhook**
   - Click **"Add webhook"** button

7. **Verify Webhook (Optional)**
   - After adding, you'll see the webhook in the list
   - Scroll right to see a green checkmark ✅ (means successful delivery)
   - Red ❌ means GitHub couldn't reach Jenkins (see troubleshooting below)

✅ **STEP 5 COMPLETE**

---

# STEP 6: FIND YOUR JENKINS IP ADDRESS (For Webhook)

### On Windows (PowerShell):

```powershell
ipconfig
```

Look for your local IP address (usually starts with `192.168.` or `10.0.`)

### Example Output:
```
IPv4 Address . . . . . . . . . . . . : 192.168.1.100
```

So your webhook URL would be: `http://192.168.1.100:8080/github-webhook/`

---

# STEP 7: TEST THE INTEGRATION

### Test with Manual Build:

1. **Go to Jenkins Dashboard**
   - Open: `http://localhost:8080`

2. **Select Your Job**
   - Click on **"blogify-pipeline"**

3. **Trigger Build Manually**
   - Click **"Build Now"** (left sidebar)
   - A new build should appear in **"Build History"** (left side)

4. **Watch the Build**
   - Click on the build number (e.g., **#1**)
   - Click **"Console Output"** to see logs
   - Wait for build to complete (shows "Finished: SUCCESS" or "Finished: FAILURE")

### Test with GitHub Push (Automated):

1. **Clone Your Repository** (if not already done)
   ```bash
   git clone https://github.com/HarshalShah2005/blogify.git
   cd blogify
   ```

2. **Make a Test Change**
   - Open any file in your repo
   - Make a small change (e.g., add a comment)
   - Save the file

3. **Commit and Push**
   ```bash
   git add .
   git commit -m "Test Jenkins integration"
   git push origin main
   ```

4. **Watch Jenkins**
   - Go to Jenkins Dashboard: `http://localhost:8080`
   - Watch the **"blogify-pipeline"** job
   - A new build should start automatically within seconds!

✅ **STEP 7 COMPLETE**

---

# TROUBLESHOOTING

## Issue: Webhook Shows Red ❌ (GitHub can't reach Jenkins)

### Problem
GitHub can't connect to your Jenkins URL. This is common if Jenkins is on `localhost`.

### Solution 1: Use ngrok (Temporary Public URL)

1. **Download ngrok**: https://ngrok.com/download
2. **Run ngrok**:
   ```bash
   ngrok http 8080
   ```
3. **Copy the URL** (looks like `https://a1b2c3d4.ngrok.io`)
4. **Update GitHub Webhook**:
   - Go to repo Settings → Webhooks
   - Edit the webhook
   - **Payload URL**: Change to `https://a1b2c3d4.ngrok.io/github-webhook/`
   - Click **"Update webhook"**
5. **Keep ngrok running** while testing

### Solution 2: Use Poll SCM (Fallback - No Webhook Needed)

If webhook doesn't work, Jenkins can check GitHub periodically:
- Jenkins job already has **"Poll SCM"** enabled
- Jenkins will check every 5 minutes for changes
- Less efficient but more reliable for local setups

### Solution 3: Port Forwarding (If Router Access)

1. Forward port 8080 from your router to Jenkins machine
2. Find your public IP: https://whatismyipaddress.com
3. Use `http://<YOUR_PUBLIC_IP>:8080/github-webhook/`
4. Update GitHub webhook with this URL

---

## Issue: Build Fails with "Docker not found"

### Problem
Jenkins can't run Docker commands.

### Solution:
```bash
# Add Jenkins user to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins
sudo systemctl restart jenkins
```

---

## Issue: "Permission denied" when cloning repository

### Problem
Jenkins can't access your GitHub repo.

### Solution:
- Verify credentials in Jenkins (STEP 3)
- Check GitHub Personal Access Token is still valid
- Ensure token has `repo` scope

---

## Issue: Build Succeeds but nothing deploys

### Problem
Docker containers aren't starting.

### Solution:
- Check **Console Output** for error messages
- Run manually: `docker-compose up -d`
- Check if port 8000, 3000, etc. are already in use

---

# SUMMARY CHECKLIST

- [ ] STEP 1: Jenkins Plugins installed (GitHub, GitHub API, Docker Pipeline)
- [ ] STEP 2: GitHub Personal Access Token created and copied
- [ ] STEP 3: Credentials added to Jenkins with ID `github-credentials`
- [ ] STEP 4: Pipeline job `blogify-pipeline` created with proper SCM config
- [ ] STEP 5: GitHub webhook added and tested
- [ ] STEP 6: Jenkins IP found and used in webhook URL
- [ ] STEP 7: Manual build triggered and successful
- [ ] STEP 7b: GitHub push triggered automatic build

---

# NEXT STEPS

Once everything works:

1. **Monitor Builds**: Check Jenkins dashboard after each push
2. **View Logs**: Click build → "Console Output" to debug issues
3. **Set Notifications** (Optional):
   - Add Slack/email notifications to Jenkins job
   - Get alerts when builds fail

---

# QUICK REFERENCE

| Item | Value |
|------|-------|
| Jenkins Dashboard | `http://localhost:8080` |
| Repository | `https://github.com/HarshalShah2005/blogify` |
| Job Name | `blogify-pipeline` |
| Jenkinsfile | Located in repo root |
| Credentials ID | `github-credentials` |
| Webhook Endpoint | `/github-webhook/` |
| Default Branch | `main` (change if different) |

---

You're all set! 🚀 Your Jenkins pipeline will now automatically build and deploy whenever you push code to GitHub.
