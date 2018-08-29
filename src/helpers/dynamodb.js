import AWS_COMMON_CONFIG from '../configs/aws.common.json';
import AWS_DYNAMODB_CONFIG from '../configs/aws.dynamodb.json';
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: AWS_COMMON_CONFIG.accessKeyId,
    secretAccessKey: AWS_COMMON_CONFIG.secretAccessKey,
    region: AWS_DYNAMODB_CONFIG.region,
    endpoint: AWS_DYNAMODB_CONFIG.endpoint
});

export const call = (action, params)=>{
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    return dynamoDb[action](params).promise();
};