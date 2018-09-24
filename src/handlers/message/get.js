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
            status: false,
            message: 'Missing querystring..! ' }));
    }
    const { groupname, startDate, endDate } = queryStringData;
    if (!groupname) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing groupname..! ' }));
    }
    if (startDate && !Date.parse(startDate)){
        return callback(null, response.badRequest({
            status: false,
            message: 'Invalid startDate..! ' }));
    }
    if (endDate && !Date.parse(endDate)){
        return callback(null, response.badRequest({
            status: false,
            message: 'Invalid endDate..! ' }));
    }

    // Get Message History
    try {
        const queryParams = {
            TableName: 'profile-chat.Messages',
            KeyConditionExpression: 'groupname = :gn AND regdate BETWEEN :sd AND :ed',
            ExpressionAttributeValues: {
                ':gn': groupname,
                ":sd": startDate || isoDatetime.getDatetimeWithDayOffset(-1),
                ":ed": endDate || isoDatetime.getNow()
            },
            Limit: 100,
            ProjectionExpression: 'regdate, content, username'
        };
        const result = await dynamodb.call('query', queryParams);

        if (result.Items.length === 0) {
            return callback(null, response.notFound({
                status: false,
                message: `no message found..!` }));
        }

        return callback(null, response.success({
            status: true,
            message: `messages are found!!`,
            data: result.Items }));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            status: false,
            message: 'Internal error..!' }));
    }
};