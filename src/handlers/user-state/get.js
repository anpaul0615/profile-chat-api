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
            status: false,
            message: 'Missing querystring..! ' }));
    }
    const username = queryStringData.username;
    if (!username) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing username..! ' }));
    }

    // Get User Data
    try {
        const params = {
            TableName: 'profile-chat.UserStates',
            Key: {
                'username': username
            }
        };
        const result = await dynamodb.call('get', params);

        if (!result.Item) {
            return callback(null, response.notFound({
                status: false,
                message: `[${username}]'s user state is not found..!` }));
        }

        return callback(null, response.success({
            status: true,
            message: `user state is found!!`,
            data: result.Item }));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            status: false,
            message: 'Internal error..!' }));
    }
};