import S3 from 'aws-sdk/clients/s3';
import appConfig from '../../config/app';
import logger from '../../infra/loaders/logger';

class AWSService {
  private _bucket: S3;

  constructor() {
    this._bucket = new S3({
      apiVersion: '2006-03-01',
      accessKeyId: appConfig.awsAccessKey,
      secretAccessKey: appConfig.awsSecretAccessKey,
      region: appConfig.awsRegion,
    });
  }

  async saveToS3(key, fileStream, contentType = 'image/png') {
    if (!key || !fileStream) {
      throw new Error('folder and filePath are required');
    }
    logger.info('AWSService:saveToS3:key=', key);
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: appConfig.awsBucket,
        Key: key,
        Body: fileStream,
        ACL: 'public-read',
        ContentType: contentType,
      };

      this._bucket.upload(params, function (err, data) {
        if (err) {
          logger.info('AWSService:saveToS3:error uploading your file: ', err);
          return reject(err);
        }
        logger.info('AWSService:saveToS3:successfully uploaded file', data.Location);

        return resolve(data.Location);
      });
    });
  }
}

export default new AWSService();
