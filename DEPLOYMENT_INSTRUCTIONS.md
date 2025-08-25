# CORS and HTTPS Fix Deployment Instructions

## What was fixed:

1. **CORS Policy Issue**: Added proper CORS headers to nginx configuration
2. **Multiple Origins Support**: Updated server.js to allow EC2 IP addresses
3. **Environment Configuration**: Updated CORS_ORIGIN to include all necessary origins
4. **Nginx Configuration**: Created new nginx config with IP support

## Files Modified:

- `nginx-https-full-working.conf` - Added CORS headers
- `server.js` - Updated CORS origins to include EC2 IPs
- `env.https.template` - Updated CORS_ORIGIN environment variable
- `docker-compose-https.yml` - Updated environment variables
- `nginx-ec2-https.conf` - New nginx config for EC2 deployment

## Deployment Steps:

1. **Copy the new nginx configuration:**
   ```bash
   cp nginx-ec2-https.conf /etc/nginx/nginx.conf
   # or update your docker-compose to use the new config
   ```

2. **Update your .env file with the new CORS_ORIGIN:**
   ```bash
   CORS_ORIGIN=https://bemyguest.dedyn.io,https://api.bemyguest.dedyn.io,http://54.93.243.196,https://54.93.243.196,http://3.72.76.56,https://3.72.76.56
   ```

3. **Restart the services:**
   ```bash
   docker-compose -f docker-compose-https.yml down
   docker-compose -f docker-compose-https.yml up -d
   ```

4. **Verify the fix:**
   - Check that CORS errors are resolved
   - Verify HTTPS is working properly
   - Test API endpoints from both domain and IP access

## Testing:

Test the following endpoints to ensure CORS is working:
- `https://bemyguest.dedyn.io/api/meals/public`
- `https://api.bemyguest.dedyn.io/api/meals/public`
- `https://54.93.243.196/api/meals/public`

## Rollback:

If issues occur, restore from backups:
```bash
cp nginx-https-full-working.conf.backup nginx-https-full-working.conf
cp env.https.template.backup env.https.template
cp docker-compose-https.yml.backup docker-compose-https.yml
cp server.js.backup server.js
```
