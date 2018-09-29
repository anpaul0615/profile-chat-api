import * as response from '../../helpers/response';
import * as dynamodb from '../../helpers/dynamodb';

/**
 * HTTP GET /messages/group/search :: Search Message Group By Username
 * 
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export const handler = async (event, context, callback)=>{
    /** Immediate response for WarmUP plugin */
    if (event.source === 'serverless-plugin-warmup') {
        console.log('[message-group.search.handler] warmup ok!!');
        return callback(null, 'message-group.search.handler is warm!!');
    }

    // Recieve Request Data
    const queryStringData = event.queryStringParameters;
    if (!queryStringData) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing querystring..! ' }));
    }
    const { username } = queryStringData;
    if (!username) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing username..! ' }));
    }

    // Search Message Group By Username
    try {
        const scanParams = {
            TableName: 'profile-chat.MessageGroups',
            FilterExpression: 'contains(#ul, :u)',
            ExpressionAttributeNames: {
                "#ul": "userList",
            },
            ExpressionAttributeValues: {
                ':u': username
            },
            ProjectionExpression: "groupname, groupnickname, lastMessage",
        };
        const result = await dynamodb.call('scan', scanParams);

        if (result.Count === 0) {
            return callback(null, response.notFound({
                status: false,
                message: `message-group is not found..!` }));
        }

        return callback(null, response.success({
            status: true,
            message: `message-group is found!!`,
            data: result.Items }));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            status: false,
            message: 'Internal error..!' }));
    }
};