# STEP 4: AWS INFRASTRUCTURE SETUP 🏗️

## Overview

This step sets up the AWS infrastructure to run your application in the cloud:
- **RDS PostgreSQL** - Managed database (production)
- **ECS Cluster** - Container orchestration
- **Task Definitions** - How containers run
- **Application Load Balancer** - Traffic distribution
- **Security Groups** - Network access control
- **IAM Roles** - Permissions & authentication

---

## What You'll Have After This Step

✅ Production PostgreSQL database (RDS)
✅ ECS cluster running backend & frontend containers
✅ Application Load Balancer with public IP
✅ Auto-scaling groups (optional but recommended)
✅ CloudWatch logs for monitoring
✅ Application accessible via ALB DNS

---

## Part 1: Create RDS PostgreSQL Database

> ⚠️ **Free Tier Note**: If using AWS free tier, you cannot have automated backups. Set **Backup retention to 0 days** (step 17 below). This is a free tier limitation, not a bug.

### Step 1.1: Create RDS Instance via AWS Console

1. Go to: https://console.aws.amazon.com/rds/home?region=us-east-1
2. Click **Create database**
3. **Engine options**: PostgreSQL
4. **Version**: PostgreSQL 18.x (latest) or 17.x (stable)
5. **Templates**: Production (recommended)
6. **DB instance identifier**: `blogify-production`
7. **Master username**: `postgres`
8. **Master password**: Create a strong password (SAVE IT!)
9. **DB instance class**: `db.t3.micro` (free tier eligible)
10. **Allocated storage**: 20 GB
11. **Storage type**: General Purpose (gp3)
12. **VPC**: Default VPC
13. **Public accessibility**: Yes
14. **VPC security group**: Create new → Name: `rds-blogify`
15. **Database name**: `blogify_production`
17. **Backup retention**: `0 days` (free tier limitation - set to 0, not 7)
17. Click **Create database**

⏳ **Wait 5-10 minutes** for creation

### Step 1.2: Save RDS Connection Details

Once created, note down:
- **Endpoint**: (looks like: `blogify-production.xxxxx.us-east-1.rds.amazonaws.com`)
- **Port**: 5432
- **Username**: postgres
- **Password**: (what you set)
- **Database**: blogify_production

### Step 1.3: Add RDS Security Group to GitHub Secrets

Go to GitHub Secrets: https://github.com/HarshalShah2005/blogify/settings/secrets/actions

Add:
- Name: `RDS_ENDPOINT`
  Value: `blogify-production.xxxxx.us-east-1.rds.amazonaws.com`

- Name: `RDS_USERNAME`
  Value: `postgres`

- Name: `RDS_PASSWORD`
  Value: (the password you created)

- Name: `RDS_DATABASE`
  Value: `blogify_production`

---

## Part 2: Create ECS Cluster

### Step 2.0: Create ECS Service-Linked Role (REQUIRED FIRST)

⚠️ **Must do this BEFORE creating the cluster!**

Run this AWS CLI command:

```bash
aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com
```

If you don't have AWS CLI installed, create it manually:
1. Go to: https://console.aws.amazon.com/iam/home#/roles/create
2. Click **Create role**
3. **Trusted entity type**: AWS service
4. **Service**: Elastic Container Service
5. **Use case**: Elastic Container Service
6. Click **Next** → **Create role**

✅ Service-linked role created

### Step 2.1: Create ECS Cluster via Console

1. Go to: https://console.aws.amazon.com/ecs/v2/clusters
2. Click **Create cluster**
3. **Cluster name**: `blogify-production`
4. **Infrastructure**: AWS Fargate (serverless, easiest)
5. **Monitoring**: Enable CloudWatch Container Insights
6. Click **Create**

✅ Cluster created

### Step 2.2: Create IAM Task Execution Role

1. Go to: https://console.aws.amazon.com/iam/home#/roles
2. Click **Create role**
3. **Use case**: Elastic Container Service
4. **Choose your use case**: Elastic Container Service Task
5. Click **Next**
6. **Permissions policies**: Select:
   - `AmazonECSTaskExecutionRolePolicy`
   - `CloudWatchLogsFullAccess`
7. Click **Next**
8. **Role name**: `ecsTaskExecutionRole-blogify`
9. Click **Create role**

✅ Role created

---

## Part 3: Create ECS Task Definitions

### Step 3.1: Backend Task Definition

1. Go to: https://console.aws.amazon.com/ecs/v2/task-definitions
2. Click **Create new task definition**
3. **Task definition family**: `blogify-backend`
4. **Launch type**: AWS Fargate
5. **Operating system**: Linux
6. **CPU**: 0.5 vCPU (lowest cost, sufficient for small apps)
7. **Memory**: 1 GB
8. **Task role**: None (for now)
9. **Task execution role**: Select `ecsTaskExecutionRole-blogify`
10. **Container definitions**: Click **Add container**
    - **Name**: `backend`
    - **Image**: Copy from ECR:
      - Go to: https://console.aws.amazon.com/ecr/repositories/blogify-backend
      - Click **View push commands**
      - Copy the full URI (looks like: `123456789.dkr.ecr.us-east-1.amazonaws.com/blogify-backend:latest`)
    - **Port mapping**: 3000
    - **Environment variables**:
      - `NODE_ENV`: production
      - `PORT`: 3000
      - `DATABASE_URL`: Replace the placeholders:
        - Replace `PASSWORD` with your RDS password from Step 1.2
        - Replace `ENDPOINT` with your RDS endpoint from Step 1.2
        - Example: `postgresql://postgres:MySecurePassword123@blogify-production.c4zb5m2q4z5x.us-east-1.rds.amazonaws.com:5432/blogify_production`
      - `JWT_SECRET`: (copy from your .env file)
    - **Log configuration**: 
      - **Log driver**: awslogs
      - **Log group**: `/ecs/blogify-backend`
      - **Log stream prefix**: `ecs`
      - **Region**: us-east-1
    - Click **Add**
11. Click **Create**

✅ Backend task definition created

### Step 3.2: Frontend Task Definition

Repeat for frontend:

1. Go to: https://console.aws.amazon.com/ecs/v2/task-definitions
2. Click **Create new task definition**
3. **Task definition family**: `blogify-frontend`
4. Same CPU/Memory/Role settings
5. **Container definitions**: 
    - **Name**: `frontend`
    - **Image**: Copy from ECR blogify-frontend:latest
    - **Port mapping**: 80
    - **Environment variables**: (none needed for frontend)
    - **Log configuration**: Same as backend but `/ecs/blogify-frontend`
6. Click **Create**

✅ Frontend task definition created

---

## Part 4: Create Security Groups

### Step 4.1: Create ALB Security Group

1. Go to: https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#SecurityGroups
2. Click **Create security group**
3. **Name**: `alb-blogify`
4. **VPC**: Default VPC
5. **Inbound rules**:
   - HTTP (port 80) from 0.0.0.0/0
   - HTTPS (port 443) from 0.0.0.0/0 (optional, setup later)
6. Click **Create security group**

### Step 4.2: Create ECS Security Group

1. Click **Create security group**
2. **Name**: `ecs-blogify`
3. **VPC**: Default VPC
4. **Inbound rules**:
   - Custom TCP (port 3000) from `alb-blogify` security group
   - Custom TCP (port 80) from `alb-blogify` security group
5. Click **Create security group**

---

## Part 5: Create Application Load Balancer

### Step 5.1: Create ALB

1. Go to: https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#LoadBalancers
2. Click **Create load balancer**
3. Choose **Application Load Balancer**
4. **Name**: `blogify-alb`
5. **Scheme**: Internet-facing
6. **IP address type**: IPv4
7. **VPC**: Default VPC
8. **Subnets**: Select all available subnets
9. **Security groups**: Select `alb-blogify`
10. **Listeners and routing**:
    - **HTTP:80** → Create target group
11. Click **Next**
12. **Target group name**: `blogify-frontend`
13. **Protocol**: HTTP
14. **Port**: 80
15. **Health check path**: `/`
16. Click **Create target group**
17. Click **Create load balancer**

✅ ALB created - Note the **DNS name** (you'll use this later)

---

## Part 6: Create ECS Services

### Step 6.1: Create Backend Service

1. Go to: https://console.aws.amazon.com/ecs/v2/clusters/blogify-production
2. Click **Create service**
3. **Launch type**: FARGATE
4. **Task definition**: `blogify-backend`
5. **Service name**: `blogify-backend-service`
6. **Desired count**: 1 (increase later for scaling)
7. **VPC**: Default VPC
8. **Subnets**: Select all
9. **Security groups**: `ecs-blogify`
10. **Load balancing**: Application Load Balancer
11. **Load balancer name**: `blogify-alb`
12. **Container**: `backend` : `3000`
13. **Target group**: Create new → `blogify-backend`
14. Click **Create service**

⏳ Wait for service to stabilize (2-3 minutes)

### Step 6.2: Create Frontend Service

Repeat for frontend:

1. Click **Create service**
2. **Task definition**: `blogify-frontend`
3. **Service name**: `blogify-frontend-service`
4. **Container**: `frontend` : `80`
5. **Target group**: `blogify-frontend` (use existing)
6. Click **Create service**

✅ Both services running

---

## Part 7: Configure ALB Routing

### Step 7.1: Add Backend Target Group

1. Go to: https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#TargetGroups
2. Create new target group:
   - **Name**: `blogify-backend`
   - **Protocol**: HTTP
   - **Port**: 3000
   - **VPC**: Default VPC
   - **Health check path**: `/health`
3. Click **Create**

### Step 7.2: Configure ALB Listener Rules

1. Go to: https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#LoadBalancers
2. Click `blogify-alb`
3. Go to **Listeners and rules** tab
4. Click **HTTP:80** listener
5. Click **Manage rules**
6. Add rule:
   - **Path**: `/api/v1/*` → Forward to `blogify-backend` target group
   - **Default**: Forward to `blogify-frontend` target group
7. Click **Save changes**

---

## Part 8: Run Database Migrations

### Step 8.1: Get ECS Task

1. Go to: https://console.aws.amazon.com/ecs/v2/clusters/blogify-production
2. Click **Services** → `blogify-backend-service`
3. Click the **Task** in the running tasks
4. Copy the **Task ID**

### Step 8.2: Run Migration

Run this in terminal (requires AWS CLI):

```bash
aws ecs execute-command \
  --cluster blogify-production \
  --task <TASK_ID> \
  --container backend \
  --interactive \
  --command "/bin/sh"
```

Inside container, run:

```bash
npx prisma migrate deploy
```

Exit with `exit`

✅ Migrations complete

---

## Part 9: Test the Application

### Test via ALB DNS

1. Get ALB DNS name: https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#LoadBalancers
2. Copy the **DNS name** (looks like: `blogify-alb-123456.us-east-1.elb.amazonaws.com`)
3. Open in browser: `http://YOUR_ALB_DNS`
4. Should see your blog application! 🎉

### Test Backend API

```bash
curl http://YOUR_ALB_DNS/api/v1/user/profile/1
```

---

## Part 10: Enable Auto-Scaling (Optional)

### Step 10.1: Create Auto Scaling Group for Backend

1. Go to: https://console.aws.amazon.com/ecs/v2/clusters/blogify-production
2. Click **Services** → `blogify-backend-service`
3. Click **Auto Scaling** tab
4. **Service-based Auto Scaling**: Enable
5. **Min capacity**: 1
6. **Max capacity**: 3
7. **Target tracking scaling policy**:
   - **Metric**: CPU utilization
   - **Target**: 70%
8. Click **Create**

✅ Auto-scaling enabled - service will scale up/down based on load

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **Tasks failing to start** | Check CloudWatch logs: `/ecs/blogify-backend` |
| **ALB returning 502** | Verify target group health checks |
| **Database connection error** | Verify RDS endpoint and security groups |
| **CORS errors** | Update `VITE_API_URL` in frontend to ALB DNS |

---

## 📁 Summary

**Created in AWS:**
- ✅ RDS PostgreSQL database
- ✅ ECS cluster with 2 services (backend + frontend)
- ✅ Application Load Balancer with routing
- ✅ Security groups for network access
- ✅ CloudWatch logs for monitoring

**Application accessible at:**
```
http://<ALB_DNS_NAME>
```

---

## 🚀 Next: Step 5

After verifying everything works:
- Set up **Route 53** for custom domain (optional)
- Enable **HTTPS/SSL** with ACM certificate
- Set up **CloudFront CDN** for frontend
- Configure **RDS backups** and monitoring

---

## ✅ STEP 4 COMPLETE CHECKLIST

- [ ] RDS PostgreSQL database created
- [ ] RDS endpoint & credentials saved
- [ ] ECS cluster created
- [ ] IAM task execution role created
- [ ] Backend task definition created
- [ ] Frontend task definition created
- [ ] ALB created and configured
- [ ] Backend service running
- [ ] Frontend service running
- [ ] Database migrations completed
- [ ] Application accessible via ALB DNS
- [ ] Backend API responding
- [ ] Frontend loads and connects to backend

---

## When You're Done

Reply with:
```
✅ STEP 4 COMPLETE!

RDS: ✅ PostgreSQL database created and migrated
ECS: ✅ Backend & Frontend services running
ALB: ✅ Load balancer routing traffic
Application: ✅ Accessible and working

Ready for Step 5: Domain & HTTPS Setup! 🚀
```
