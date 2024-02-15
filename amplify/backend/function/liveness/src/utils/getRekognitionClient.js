const { Rekognition } = require("@aws-sdk/client-rekognition");

const getRekognitionClient = () => {
  const rekognitionClient = new Rekognition({
    region: 'us-east-1'
  });

  return rekognitionClient;
};

module.exports = getRekognitionClient;