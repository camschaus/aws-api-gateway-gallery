# aws-api-gateway-gallery
This repository contains everything you need to deploy a sample photo gallery web application,
using AWS managed services, including lambda and API-gateway.

The templates assume that you host your domain DNS using AWS route 53.  If this is not the case,
you can modify the cf-templates/gallery.static.json accordingly.  The templates will build an s3
bucket with a name matching the FQDN of the site, eg. gallery.schaus.ca.

You will need to have the aws CLI installed and configured with credentials, as well as nodejs installed.

Follow these steps to deploy this sample application:

1. create a lambda code bucket and update lambda/gallery/package.json with bucket name

    *aws s3 s3://lambda-code-bucket-name*

1. Build and deploy the lambda function

    *(cd lambda/gallery; npm install && npm run-script package && npm run-script deploys3)*

1. modify default parameters for the cf-templates/gallery-*.json, or note parameters to specify when using cloudformation create-stack commands below

1. Create the static web components

    *aws cloudformation create-stack --stack-name cds-gallery-1 --template-body file://cf-templates/gallery-static.json --capabilities CAPABILITY_IAM*
    
1. Create the API components

    *aws cloudformation create-stack --stack-name cds-gallery-api-1 --template-body file://cf-templates/gallery-api.json --capabilities CAPABILITY_IAM*
    
1. Find the API Gateway URL.  From the AWS Console, go to API Gateway -> Gallery API -> Stages -> Prod and copy the URL.  Edit src/index.html and update the *api* variable with this value.

1. build and deploy the static web content

    *npm install -g bower*
    *bower install*
    *npm run-script deploy*
    
1. Seed the DynamoDB table

    *(cd util; npm install && node addGallery.js)*
    
