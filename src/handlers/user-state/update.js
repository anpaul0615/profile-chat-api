import * as bodyParser from '../../helpers/body-parser';
import * as response from '../../helpers/response';
import * as dynamodb from '../../helpers/dynamodb';

/**
 * HTTP PUT /users/state :: Update User State
 * 
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export const handler = async (event, context, callback)=>{
    /** Immediate response for WarmUP plugin */
    if (event.source === 'serverless-plugin-warmup') {
        console.log('[user-state.update.handler] warmup ok!!');
        return callback(null, 'user-state.update.handler is warm!!');
    }

    // Recieve Body Data
    const bodyDataString = event.body;
    if (!bodyDataString) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing body data..! ' }));
    }
    const bodyData = bodyParser.toObject(bodyDataString);
    if (typeof(bodyData) !== 'object') {
        return callback(null, response.badRequest({
            status: false,
            message: 'Invalid body data..! ' }));
    }
    const { userId, userName, isConnected } = bodyData;
    if (!userId) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing userId..! ' }));
    }
    if (!userName) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing userName..! ' }));
    }
    if (isConnected === undefined) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing connection-data..! ' }));
    }
    if (typeof(isConnected) !== 'boolean') {
        return callback(null, response.badRequest({
            status: false,
            message: 'Invalid connection-data..! ' }));
    }

    try {
        // Update & Get Old Data
        const putParams = {
            TableName: 'profile-chat.UserStates',
            Item: {
                "userId": userId,
                'userName': userName,
                "isConnected": isConnected
            },
            ReturnValues: "ALL_OLD"
        };
        const putResult = await dynamodb.call('put', putParams);

        // Get Updated Data
        const getParams = {
            TableName: 'profile-chat.UserStates',
            Key: {
                'userId': userId
            }
        };
        const getResult = await dynamodb.call('get', getParams);

        // Response
        return callback(null, response.success({
            status: true,
            message: `user state is updated!!`,
            data: {
                old: putResult.Attributes || null,
                new: getResult.Item,
            }}));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            status: false,
            message: 'Internal error..!' }));
    }
};