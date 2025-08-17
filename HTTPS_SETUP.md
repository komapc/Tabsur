# HTTPS Setup Guide for Tabsur

This guide explains how to set up HTTPS for the `bemyguest.dedyn.io` domain.

## Prerequisites

- AWS CLI configured with appropriate permissions
- Domain `bemyguest.dedyn.io` accessible for DNS configuration
- SSL certificate created in AWS Certificate Manager (ACM)

## Current Status

✅ **SSL Certificate Created**: `arn:aws:acm:eu-central-1:272007598366:certificate/61585d26-3206-4f76-a758-e759af5a6cc3`

⚠️ **Status**: Pending validation (requires DNS configuration)

## Step 1: SSL Certificate Validation

The SSL certificate is currently pending validation. You need to add the following DNS records to your domain:

### For `bemyguest.dedyn.io`:
```
Type: CNAME
Name: _9c8796343528237615f2e79fb1ed09d5.bemyguest.dedyn.io
Value: _40ef9ff99464e3fcc730d99d57e1d8d3.xlfgrmvvlj.acm-validations.aws
```

### For `www.bemyguest.dedyn.io`:
```
Type: CNAME
Name: _b634e792f4e9ecbb97fcb39ad8e831d9.www.bemyguest.dedyn.io
Value: _7ced9a3e45c37d7ba663a892213cb6e0.xlfgrmvvlj.acm-validations.aws
```

## Step 2: Domain DNS Configuration

Since `dedyn.io` is a dynamic DNS service, you need to:

1. **Access your dedyn.io account** (where `bemyguest` subdomain is registered)
2. **Add an A record** pointing to your ALB:
   ```
   Type: A
   Name: bemyguest
   Value: [ALB_IP_ADDRESSES]
   ```

3. **Get ALB IP addresses**:
   ```bash
   nslookup prod-tabsur-alb-2109180600.eu-central-1.elb.amazonaws.com
   ```

4. **Add multiple A records** for each IP address returned by the nslookup

## Step 3: Enable HTTPS

Once the SSL certificate is validated and the domain points to your ALB:

1. **Update Terraform configuration**:
   ```bash
   cd terraform
   ```

2. **Edit `terraform.tfvars`**:
   ```hcl
   # ALB Configuration
   certificate_arn = "arn:aws:acm:eu-central-1:272007598366:certificate/61585d26-3206-4f76-a758-e759af5a6cc3"
   enable_https = true
   ```

3. **Apply changes**:
   ```bash
   terraform apply
   ```

## Step 4: Test HTTPS

After enabling HTTPS:

1. **Test HTTP to HTTPS redirect**:
   ```bash
   curl -I http://bemyguest.dedyn.io/health
   # Should return 301 redirect to HTTPS
   ```

2. **Test HTTPS directly**:
   ```bash
   curl -I https://bemyguest.dedyn.io/health
   # Should return 200 OK
   ```

3. **Test API endpoint**:
   ```bash
   curl -I https://bemyguest.dedyn.io/api/system/health
   # Should return 200 OK
   ```

## Current ALB Configuration

- **ALB DNS Name**: `prod-tabsur-alb-2109180600.eu-central-1.elb.amazonaws.com`
- **HTTP Listener**: Port 80 (redirects to HTTPS when enabled)
- **HTTPS Listener**: Port 443 (when enabled)
- **Target Groups**: 
  - Client (Frontend): Port 80
  - Server (API): Port 5000

## Troubleshooting

### Certificate Validation Issues
- Ensure DNS records are properly configured
- Wait for DNS propagation (can take up to 48 hours)
- Check certificate status: `aws acm describe-certificate --certificate-arn [arn]`

### Domain Resolution Issues
- Verify A records point to correct ALB IPs
- Check if dedyn.io service is working
- Test with `nslookup bemyguest.dedyn.io`

### HTTPS Not Working
- Verify SSL certificate is validated
- Check ALB security groups allow port 443
- Ensure `enable_https = true` in Terraform

## Security Headers

The application already includes security headers:
- HSTS (HTTP Strict Transport Security)
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## Next Steps

1. ✅ Complete SSL certificate validation
2. ✅ Configure domain DNS to point to ALB
3. ✅ Enable HTTPS in Terraform
4. ✅ Test HTTPS functionality
5. ✅ Update any hardcoded HTTP URLs in the application

## Support

If you encounter issues:
1. Check AWS CloudWatch logs
2. Verify ALB target group health
3. Test individual container endpoints
4. Review Terraform state and outputs
