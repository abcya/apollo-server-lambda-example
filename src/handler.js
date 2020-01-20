const { ApolloServer, gql } = require('apollo-server-lambda')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const { uuid } = require('uuidv4')
const path = require('path')

// Define your already-created S3 Bucket name
const Bucket = 'YourBucketNameHere'

const typeDefs = gql`
  scalar Upload

  type File {
    id: String
    filename: String
    mimetype: String
    encoding: String
  }
  type Query {
    hello: String
    event: String
  }
  type Mutation {
    singleUpload(file: Upload): File!
    multiUpload(files: [Upload!]!): [File!]!
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  },
  Mutation: {
    singleUpload: async (_, { file }) => {
      console.log('here')
      await uploadFile(file)
      return file
    },
    multiUpload: async (parent, { files }) => {
      const fileArray = await files
      fileArray.forEach(async file => {
        expect((await file).stream).toBeDefined()
      })
      return fileArray
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: receivedContext => ({
    ...receivedContext
  })
})

const uploadFile = async file => {
  return new Promise(async (resolve, reject) => {
    try {
      // Read content from the file
      // const { filename, mimetype, createReadStream } = await file
      const { stream, filename, mimetype } = await file

      const Body = stream
      const Key = uuid() + path.extname(filename)
      const params = {
        Bucket, // const defined above
        Key, // File name you want to save as in S3
        Body,
        ContentType: mimetype
      }

      // Uploading files to the bucket
      s3.upload(params, function(err, data) {
        if (err) {
          console.log('s3 upload error')
          throw err
        }
        console.log(`File uploaded to s3 successfully. ${data.Location}`)
        resolve(true)
      })
    } catch (e) {
      console.log('UPLOAD ERROR: ', e)
      reject(e)
    }
  })
}

exports.graphql = (event, lambdaContext, callback) => {
  server.createHandler()(event, lambdaContext, callback)
}
