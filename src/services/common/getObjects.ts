import AWS from "aws-sdk";
import Log from "./logUtil";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET,
  prefix: process.env.AWS_PREFIX
};

AWS.config.setPromisesDependency(null);

AWS.config.update({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region
});

const s3 = new AWS.S3();
const log = new Log();

const getObjects = async (key: string) => {
  console.log({ key });
  const facility = "getObjects.ts/getObjects()";
  const params = {
    Bucket: awsConfig.bucket,
    Key: process.env.AWS_PREFIX + key
  };

  try {
    return await s3.getObject(params).promise();
  } catch (e) {
    log.getResponse(`getObjects() catch: ${e}`, false, facility);
    return { success: false, message: e.message };
  }
};

module.exports = {
  download: async (file: string) => {
    return await getObjects(file);
  }
};
