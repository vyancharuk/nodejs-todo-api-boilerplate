import S3 from 'aws-sdk/clients/s3';
import appConfig from '../../config/app';

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
          console.log('There was an error uploading your file: ', err);
          return reject(err);
        }
        console.log('Successfully uploaded file.', data.Location);

        return resolve(data.Location);
      });
    });
  }
}

export default new AWSService();
