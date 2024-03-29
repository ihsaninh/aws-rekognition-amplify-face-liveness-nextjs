/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const getRekognitionClient = require("./utils/getRekognitionClient");

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


app.get("/session/create", async function (req, res) {
  const rekognition = getRekognitionClient();
  const response = await rekognition.createFaceLivenessSession({});

  return res.status(200).json({
    sessionId: response.SessionId,
  });
});

app.get("/session/get", async function (req, res) {
  const rekognition = getRekognitionClient();
  const response = await rekognition.getFaceLivenessSessionResults({
    SessionId: req.query.sessionId,
  });

  const referenceImageBuffer = Buffer.from(response.ReferenceImage.Bytes, 'base64');
  const referenceImageBase64 = referenceImageBuffer.toString('base64');
  response.ReferenceImage.Bytes = referenceImageBase64;

  res.status(200).json({ response });
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
