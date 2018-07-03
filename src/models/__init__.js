import CONFIG from '../../conf/aws.credentials.json';
import AWS from 'aws-sdk';

export default async function() {

    /* Init Access Configuration */
    AWS.config.update({
        accessKeyId: CONFIG.accessKeyId,
        secretAccessKey: CONFIG.secretAccessKey,
        region: CONFIG.region,
        endpoint: CONFIG.endpoint,
    });
    
    /* Table Init Functions */
    function DescribeTable(model){
        return new Promise((resolve,reject)=>{
            model.describeTable((err,data)=>{
                if (err) {
                    reject({
                        message: '[Fail] Table Describe Fail..!',
                        data,
                        err
                    });
                } else {
                    resolve({
                        message: '[Done] Table Describe Success!!',
                        data,
                        err
                    });
                }
            });
        });
    }
    function CreateTable(model){
        return new Promise((resolve,reject)=>{
            model.createTable((err,data)=>{
                if (err) {
                    reject({
                        message: '[Fail] Table Create Fail..!',
                        data,
                        err
                    });
                } else {
                    resolve({
                        message: '[Done] Table Create Success!!',
                        data,
                        err
                    });
                }
            });
        });
    }
    
    /* Load Models & Init Tables */
    function CreateTableIfNotExist(model){
        return DescribeTable(model)
        .catch(err=>{
            // console.log(err);
            return CreateTable(model);
        })
        .then(result=>{
            console.log('[models.__init__] CreateTableIfNotExist() :: ', result);
            return model;
        });
    }
    const docClient = new AWS.DynamoDB.DocumentClient();
    const Models = {};
    try {
        Models.User = await CreateTableIfNotExist(
            require('./User')(docClient)
        );

    } catch(e) {
        console.log('[models.__init__] Load Models & Init Tables Fail..!', e);
    }
    

    /* Return Models */
    console.log('[models.__init__] Init Model OK!!');
    return Models;
}