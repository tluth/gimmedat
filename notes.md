# General TODOS:
* ~~Hide previous upload link once you start uploading a new one~~
* ~~Item has expired message~~
* ~~Add percentage progress counter ~~
* ~~Add fine print saying file will be available for download for 48hrs + that the filesize limit is 1gb ~~
* ~~New file icon~~
* Maybe add an actual button to select file in dropzone (e.g. soundcloud) 
* ~~Error message for oversize file~~
* Support page (with captcha if adding contact form) + link to GitHub 
* ~~Try add shadow to dropzone~~
* ~~More clear lines within dropzone - maybe bring dotted border inside  bit ~~
* ~~Add menu burger icon to open other pages - cli info, project info ~~
* Add security tests / look into free tools you can use to test security (maybe set up to run on scheduled gh action)
* Add regular unit tests + linting 
* store files under our own unique names rather than user provided names 
* https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html#web-app-manifest customize manifest


## API DNS Issues:
  - https://stackoverflow.com/questions/36737313/how-to-cname-to-amazon-api-gateway-endpoint/45849093#45849093
  - https://stackoverflow.com/questions/36466092/custom-domain-for-api-gateway-returning-403


# AWS Free tier Quotas 31/3/24

### DynamoDB
* 25 GB of Storage
* 25 provisioned Write Capacity Units (WCU)
* 25 provisioned Read Capacity Units (RCU)
* Enough to handle up to 200M requests per month.

### Lambda
* 1,000,000 free requests per month
* Up to 3.2 million seconds of compute time per month

### Cloudwatch
* 10 Custom Metrics and 10 Alarms
* 1,000,000 API Requests
* 5GB of Log Data Ingestion and 5GB of Log Data Archive
* 3 Dashboards with up to 50 Metrics Each per Month

### cloudfront 
* 1 TB of data transfer out to the internet per month
* 10,000,000 HTTP or HTTPS Requests per month
* 2,000,000 CloudFront Function invocations per month
* 2,000,000 CloudFront KeyValueStore reads per month

### SNS
* 1,000,000 Publishes
* 100,000 HTTP/S Deliveries
* 1,000 Email Deliveries

