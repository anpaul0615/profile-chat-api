import * as response from '../../helpers/response';
import * as dynamodb from '../../helpers/dynamodb';

/**
 * HTTP GET /users/state :: Get User State
 * 
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export const handler = async (event, context, callback)=>{
    /** Immediate response for WarmUP plugin */
    if (event.source === 'serverless-plugin-warmup') {
        console.log('[user-state.get.handler] warmup ok!!');
        return callback(null, 'user-state.get.handler is warm!!');
    }

    // Recieve Request Data
    const queryStringData = event.queryStringParameters;
    if (!queryStringData) {
        return callback(null, response.badRequest({
            message: 'Missing querystring..! ' }));
    }
    const userId = queryStringData.userName;
    if (!userId) {
        return callback(null, response.badRequest({
            message: 'Missing userId..! ' }));
    }

    // Get User Data
    try {
        const params = {
            TableName: 'profile-chat.UserStates',
            Key: {
                'userId': userId
            }
        };
        const result = await dynamodb.call('get', params);

        if (!result.Item) {
            return callback(null, response.notFound({
                message: `[${userId}]'s user state is not found..!`,
                data: {} }));
        }

        return callback(null, response.success({
            message: `user state is found!!`,
            data: result.Item }));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            message: 'Internal error..!' }));
    }
};