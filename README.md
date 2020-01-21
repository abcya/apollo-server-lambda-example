# apollo-server-lambda-example

## Get started

**Clone the repository**

**Install dependencies**

```sh
yarn # or npm install
```

**Run Locally**

```sh
yarn start   # or npm run start

# or

npx serverless offline start
```

**Client Testing**

A great client to use for testing multipart/form-data attachments via GraphQL Mutations is [Altair](https://sirmuel.design/working-with-file-uploads-using-altair-graphql-d2f86dc8261f)

You can then supply this mutation and attach a file with a field name of `somefile` from Altair's file browser.

```
mutation($somefile: Upload){
  singleUpload(file: $somefile) {
    filename
    mimetype
    encoding
  }
}
```

**Deployment:**

We can deploy the existing solution by using [Serverless](https://serverless.com) then run

- `serverless config credentials --provider aws --key AWS_ACCESS_KEY_ID --secret AWS_SECRET_ACCESS_KEY`
- `serverless deploy`

_IMPORTANT_

If using serverless, this will automatically take care of adding a binary media type
for `multipart/form-data` to API Gateway via the [`serverless-apigw-binary`](https://github.com/maciejtreder/serverless-apigw-binary) module.

If you're deploying this manually or with some other deployment method (apex, etc), you need to do the following:

Configure API Gateway at AWS Console.

1. Go to API Gateway.

2. Select your API in API Gateway interface
   ![capture](https://user-images.githubusercontent.com/20258226/33311015-d7901538-d423-11e7-84d8-73b8cff51b42.PNG)

3. Go to Settings
   ![capture](https://user-images.githubusercontent.com/20258226/35557894-cee549a8-05a6-11e8-98b6-8e152cac563f.PNG)

4. Add multipart/form-data binary media type
   ![capture](https://user-images.githubusercontent.com/20258226/35558023-387aefa8-05a7-11e8-9cb8-795b7b464d5b.PNG)

5. Go to Resources -> POST method of your API -> Integration Request
   ![capture](https://user-images.githubusercontent.com/20258226/33311472-324188d0-d425-11e7-9930-86fbad3db181.PNG)

6. Check Use Lambda Proxy Integration
   ![capture](https://user-images.githubusercontent.com/20258226/33311533-57ea733a-d425-11e7-8297-485045c8959e.PNG)

7. Deploy your API changes
   ![capture](https://user-images.githubusercontent.com/20258226/33311608-9cf019a8-d425-11e7-881f-874577a6c4e2.PNG)
