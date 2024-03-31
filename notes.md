
- TODOS
  1. set up dependencies and look into https://pypi.org/project/fastapi-cognito/
  2. https://betterprogramming.pub/secure-aws-api-gateway-with-amazon-cognito-and-aws-lambda-535e7c9ffea1
  3. deployment of api - https://medium.com/thelorry-product-tech-data/aws-lambda-fastapi-ci-cd-pipeline-with-github-actions-c414866b2d48


* API DNS:
  - https://stackoverflow.com/questions/36737313/how-to-cname-to-amazon-api-gateway-endpoint/45849093#45849093
  - https://stackoverflow.com/questions/36466092/custom-domain-for-api-gateway-returning-403


# AWS Free tier Quotas 31/3/24

DynamoDB
    25 GB of Storage
    25 provisioned Write Capacity Units (WCU)
    25 provisioned Read Capacity Units (RCU)
    Enough to handle up to 200M requests per month.

Lambda
    1,000,000 free requests per month
    Up to 3.2 million seconds of compute time per month

Cloudwatch
    10 Custom Metrics and 10 Alarms
    1,000,000 API Requests
    5GB of Log Data Ingestion and 5GB of Log Data Archive
    3 Dashboards with up to 50 Metrics Each per Month


cloudfront 
    1 TB of data transfer out to the internet per month
    10,000,000 HTTP or HTTPS Requests per month
    2,000,000 CloudFront Function invocations per month
    2,000,000 CloudFront KeyValueStore reads per month

SNS
    1,000,000 Publishes
    100,000 HTTP/S Deliveries
    1,000 Email Deliveries

