import * as isoDatetime from '../../helpers/iso-datetime';
import * as response from '../../helpers/response';
import * as dynamodb from '../../helpers/dynamodb';

/**
 * HTTP GET /messages :: Get Message History
 * 
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export const handler = async (event, context, callback)=>{
    /** Immediate response for WarmUP plugin */
    if (event.source === 'serverless-plugin-warmup') {
        console.log('[message.get.handler] warmup ok!!');
        return callback(null, 'message.get.handler is warm!!');
    }

    // Recieve Request Data
    const queryStringData = event.queryStringParameters;
    if (!queryStringData) {
        return callback(null, response.badRequest({
            message: 'Missing querystring..! ' }));
    }
    const { groupId, startDate, endDate, limit } = queryStringData;
    if (!groupId) {
        return callback(null, response.badRequest({
            message: 'Missing groupId..! ' }));
    }
    if (startDate && !Date.parse(startDate)){
        return callback(null, response.badRequest({
            message: 'Invalid startDate..! ' }));
    }
    if (endDate && !Date.parse(endDate)){
        return callback(null, response.badRequest({
            message: 'Invalid endDate..! ' }));
    }

    // Get Message History
    try {
        const queryParams = {
            TableName: 'profile-chat.Messages',
            KeyConditionExpression: 'groupId = :gi AND regDate BETWEEN :sd AND :ed',
            ExpressionAttributeValues: {
                ':gi': groupId,
                ":sd": startDate || isoDatetime.getDatetimeWithDayOffset(-1),
                ":ed": endDate || isoDatetime.getNow()
            },
            ScanIndexForward: false,
            Limit: limit || 50,
            ProjectionExpression: 'regDate, content, userName'
        };
        const result = await dynamodb.call('query', queryParams);

        if (result.Items.length === 0) {
            return callback(null, response.notFound({
                message: `no message found..!`,
                data: [] }));
        }

        return callback(null, response.success({
            message: `messages are found!!`,
            data: result.Items }));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            message: 'Internal error..!' }));
    }
};