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
            message: 'Missing querystring..! ' }));
    }
    const { userName } = queryStringData;
    if (!userName) {
        return callback(null, response.badRequest({
            message: 'Missing userName..! ' }));
    }

    // Search Message Group By Username
    try {
        const scanParams = {
            TableName: 'profile-chat.MessageGroups',
            FilterExpression: 'contains(#ul, :u)',
            ExpressionAttributeNames: {
                "#ul": "groupUsers",
            },
            ExpressionAttributeValues: {
                ':u': userName
            },
            ProjectionExpression: "groupId, groupName, lastMessage",
        };
        const result = await dynamodb.call('scan', scanParams);

        if (result.Count === 0) {
            return callback(null, response.notFound({
                message: `message-group is not found..!`,
                data: [] }));
        }

        return callback(null, response.success({
            message: `message-group is found!!`,
            data: result.Items }));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            message: 'Internal error..!' }));
    }
};