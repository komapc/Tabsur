# GitHub Actions Workflows

## Active Workflows

### `ci.yml` - Continuous Integration & Deployment
**Status**: ✅ Active  
**Purpose**: Automated testing, linting, security scanning, Docker builds, and deployment

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs**:
- Lint and test (both server and client)
- Security scanning with Trivy
- Docker image builds
- Integration tests
- Auto-deployment to staging/production

### `deploy.yml` - Manual Deployment
**Status**: ✅ Active  
**Purpose**: Manual deployment control for staging and production environments

**Triggers**:
- Manual workflow dispatch
- Release publication

## Disabled Workflows

### `crunch42-analysis.yml.disabled` - 42Crunch API Security Audit
**Status**: ⏸️ Disabled (to prevent authentication errors)  
**Purpose**: REST API security scanning using 42Crunch

**To Enable**:
1. Create free account at [42Crunch Platform](https://platform.42crunch.com/register)
2. Generate API token in platform settings
3. Add `API_TOKEN` secret to GitHub repository settings
4. Rename `crunch42-analysis.yml.disabled` to `crunch42-analysis.yml`
5. Commit the change

**Why Disabled?**:
- Prevents workflow failures when API token is not configured
- Eliminates unauthorized access errors
- Keeps CI/CD pipeline clean and functional

## Quick Actions

### Enable 42Crunch Security Scanning
```bash
# After configuring API_TOKEN secret
cd .github/workflows
mv crunch42-analysis.yml.disabled crunch42-analysis.yml
git add crunch42-analysis.yml
git commit -m "Enable 42Crunch API security scanning"
git push
```

### Check Workflow Status
- Go to **Actions** tab in GitHub repository
- View recent workflow runs and their status
- Check logs for any issues

### Manual Deployment
1. Go to **Actions** tab
2. Select "Deploy Application" workflow
3. Click "Run workflow"
4. Choose environment and version
5. Click "Run workflow" to deploy

## Configuration Required

### Repository Secrets
Add these in **Settings → Secrets and variables → Actions**:

```bash
# Production deployment (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# 42Crunch API scanning (optional)
API_TOKEN=your_42crunch_api_token
```

### Environment Protection
Configure in **Settings → Environments**:
- `staging`: Auto-deploy from develop branch
- `production`: Require reviews, auto-deploy from main branch

## Troubleshooting

### Workflow Failures
1. Check **Actions** tab for error details
2. Review job logs for specific errors
3. Ensure required secrets are configured
4. Verify branch protection rules

### 42Crunch Errors
- **Issue**: "Unauthorized" or "API token" errors
- **Solution**: The workflow is now disabled by default to prevent this
- **Enable when ready**: Follow the steps above to enable after configuring API token

### Deployment Issues
- Check AWS credentials and permissions
- Verify environment variables
- Review Docker build logs
- Ensure health checks pass