# aws-api-gateway-gallery
This repository contains everything you need to deploy a sample photo gallery web application,
using AWS managed services, including lambda and API-gateway.

The templates assume that you host your domain DNS using AWS route 53.  If this is not the case,
you can modify the cf-templates/gallery.static.json accordingly.

Follow these steps to deploy this sample application:
1. create a lambda code bucket and update lambda/gallery/package.json with bucket name
    aws s3 s3://lambda-code-bucket-name
1. modify default parameters for the cf-templates/gallery-*.json, or note parameters to specify when using cloudformation create-stack commands below


