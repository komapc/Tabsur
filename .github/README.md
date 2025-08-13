# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD, testing, and deployment.

## 🔄 Workflows Overview

### 1. `ci.yml` - Continuous Integration
**Trigger**: Push/PR to main, develop branches
**Purpose**: Automated testing, linting, security scanning, and Docker builds

**Jobs**:
- **lint-and-test**: Runs ESLint and unit tests for both client and server
- **security-scan**: Trivy vulnerability scanning and npm audit
- **build-docker**: Builds and pushes Docker images to GitHub Container Registry
- **integration-test**: Full stack testing with PostgreSQL and Redis
- **deploy-staging**: Automatic deployment to staging (develop branch)
- **deploy-production**: Automatic deployment to production (main branch)

### 2. `deploy.yml` - Manual Deployment
**Trigger**: Manual dispatch or release publication
**Purpose**: Controlled deployment to staging or production

**Features**:
- Environment selection (staging/production)
- Version specification
- AWS integration
- Rollback on failure
- Post-deployment validation

### 3. `crunch42-analysis.yml` - API Security Audit
**Trigger**: Push/PR to main/master, scheduled weekly
**Purpose**: REST API security scanning using 42Crunch

**Requirements**:
- `API_TOKEN` secret must be configured
- OpenAPI specification files must be present

## 🔧 Setup Instructions

### Required Secrets
Configure these in GitHub repository settings → Secrets and variables → Actions:

#### Production Deployment
```bash
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

#### 42Crunch API Security (Optional)
```bash
API_TOKEN=your_42crunch_api_token
```

### Required Variables
Configure these in GitHub repository settings → Secrets and variables → Actions → Variables:

```bash
AWS_REGION=us-east-1
```

### Environment Protection Rules
1. Go to Settings → Environments
2. Create `staging` and `production` environments
3. Configure protection rules:
   - **Staging**: No restrictions (auto-deploy from develop)
   - **Production**: Required reviewers, restrict to main branch

## 🚀 Usage

### Automatic Workflows
- **Push to develop**: Triggers CI → Build → Deploy to staging
- **Push to main**: Triggers CI → Build → Deploy to production
- **Pull requests**: Triggers CI → Tests and security scans

### Manual Deployment
1. Go to Actions tab in GitHub
2. Select "Deploy Application" workflow
3. Click "Run workflow"
4. Choose environment and version
5. Click "Run workflow"

### Monitoring Deployments
- Check Actions tab for workflow status
- Review logs for each job
- Monitor deployment environments
- Check health endpoints post-deployment

## 📊 Status Badges
Add these to your README.md:

```markdown
[![CI/CD](https://github.com/yourusername/Tabsur/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/Tabsur/actions/workflows/ci.yml)
[![Security Scan](https://github.com/yourusername/Tabsur/actions/workflows/crunch42-analysis.yml/badge.svg)](https://github.com/yourusername/Tabsur/actions/workflows/crunch42-analysis.yml)
```

## 🛠️ Customization

### Adding New Environments
1. Create new environment in repository settings
2. Update `deploy.yml` workflow
3. Add environment-specific configuration

### Custom Deployment Scripts
Modify the deployment jobs in workflows to:
- Use your specific infrastructure (AWS ECS, Kubernetes, etc.)
- Add custom health checks
- Integrate with monitoring tools
- Configure notification systems

### Test Configuration
Update test jobs to:
- Add more test types (e2e, performance)
- Configure test databases
- Add code coverage requirements
- Integrate with external testing services

## 🚨 Troubleshooting

### Common Issues

#### 1. Workflow Fails with "Secret not found"
**Solution**: Ensure all required secrets are configured in repository settings

#### 2. Docker Build Fails
**Solution**: Check Dockerfile syntax and build context

#### 3. Tests Fail in CI but Pass Locally
**Solution**: Ensure consistent Node.js versions and environment variables

#### 4. 42Crunch Unauthorized Error
**Solution**: 
- Verify API_TOKEN is correctly configured
- Ensure 42Crunch account is active
- Check OpenAPI files are present

#### 5. Deployment Fails
**Solution**:
- Check AWS credentials and permissions
- Verify environment variables are set
- Review deployment logs for specific errors

### Debug Workflow Issues
1. Check workflow logs in Actions tab
2. Enable debug logging: Set `ACTIONS_RUNNER_DEBUG` secret to `true`
3. Review individual job steps
4. Check repository permissions and secrets

## 📞 Support
For workflow issues:
1. Check this documentation
2. Review GitHub Actions documentation
3. Check repository issues
4. Contact development team