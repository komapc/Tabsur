# 🛡️ Branch Protection Rules

## Required Setup in GitHub Repository Settings

### **Main Branch Protection**

1. Go to **Settings** → **Branches**
2. Click **Add rule** for `main` branch
3. Configure the following:

#### **✅ Required Status Checks**
- **Require status checks to pass before merging**
- **Require branches to be up to date before merging**
- **Status checks that are required:**
  - `quality-check` (PR Quality Check workflow)
  - `security-scan` (Security Scan workflow)

#### **✅ Required Pull Request Reviews**
- **Require a pull request before merging**
- **Require approvals:** `2` (or your team's preference)
- **Dismiss stale PR approvals when new commits are pushed**
- **Require review from code owners**

#### **✅ Restrictions**
- **Restrict pushes that create files larger than:** `100 MB`
- **Require linear history**
- **Require signed commits** (optional but recommended)

### **Develop Branch Protection**

1. Add rule for `develop` branch
2. Similar settings but can be less strict:
   - **Required approvals:** `1`
   - **Required status checks:** Same as main

### **Feature Branch Naming Convention**

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Urgent fixes
- `chore/description` - Maintenance tasks

## 🔒 Security Features

### **Code Owners**
Create `.github/CODEOWNERS` file:
```
# Global owners
* @your-username

# Backend specific
/server/ @backend-team
/client/ @frontend-team
/terraform/ @devops-team
```

### **Required Secrets**
Ensure these secrets are set in repository:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SNYK_TOKEN` (for security scanning)

## 📋 Workflow Summary

1. **PR Created** → Triggers quality checks
2. **Quality Checks Pass** → Allows merge
3. **Code Review Approved** → Allows merge
4. **Merged to Main** → Triggers deployment
5. **Deployment** → Builds and deploys to production

## 🚨 What Happens on Failure

- **Tests Fail** → PR cannot be merged
- **Security Issues** → PR cannot be merged
- **Linting Fails** → PR cannot be merged
- **Coverage Below Threshold** → PR cannot be merged

## 🔄 Rollback Process

If deployment fails:
1. **Automatic Rollback** to previous version
2. **Notification** to team
3. **Investigation** of failure
4. **Fix and Redeploy**

---

**Remember:** These rules ensure code quality and prevent broken code from reaching production! 🚀
