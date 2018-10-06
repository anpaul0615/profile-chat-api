import * as response from '../../helpers/response';
import * as dynamodb from '../../helpers/dynamodb';

/**
 * HTTP GET /messages/group :: Get Message Group
 * 
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export const handler = async (event, context, callback)=>{
    /** Immediate response for WarmUP plugin */
    if (event.source === 'serverless-plugin-warmup') {
        console.log('[message-group.get.handler] warmup ok!!');
        return callback(null, 'message-group.get.handler is warm!!');
    }

    // Recieve Request Data
    const queryStringData = event.queryStringParameters;
    if (!queryStringData) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing querystring..! ' }));
    }
    const { groupId } = queryStringData;
    if (!groupId) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing groupId..! ' }));
    }

    // Get Message Group
    try {
        const params = {
            TableName: 'profile-chat.MessageGroups',
            Key: {
                'groupId': groupId
            }
        };
        const result = await dynamodb.call('get', params);

        if (!result.Item) {
            return callback(null, response.notFound({
                status: false,
                message: `no message-group found..!` }));
        }

        return callback(null, response.success({
            status: true,
            message: `message-group is found!!`,
            data: result.Item }));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            status: false,
            message: 'Internal error..!' }));
    }
};