import * as bodyParser from '../../helpers/body-parser';
import * as response from '../../helpers/response';
import * as dynamodb from '../../helpers/dynamodb';

/**
 * HTTP POST /messages :: Append New Message
 * 
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export const handler = async (event, context, callback)=>{
    /** Immediate response for WarmUP plugin */
    if (event.source === 'serverless-plugin-warmup') {
        console.log('[message.append.handler] warmup ok!!');
        return callback(null, 'message.append.handler is warm!!');
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
    const { groupId, regDate, content, userName } = bodyData;
    if (!groupId) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing groupId..! ' }));
    }
    if (!regDate) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing regDate..! ' }));
    }
    if (!Date.parse(regDate)){
        return callback(null, response.badRequest({
            status: false,
            message: 'Invalid regDate..! ' }));
    }
    if (!content) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing content..! ' }));
    }
    if (!userName) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing userName..! ' }));
    }

    // Append New Message
    try {
        const putParams = {
            TableName: 'profile-chat.Messages',
            Item: {
                "groupId": groupId,
                "regDate": regDate,
                "content": content,
                "userName": userName
            }
        };
        await dynamodb.call('put', putParams);

        return callback(null, response.success({
            status: true,
            message: `new message is appended!!`
            }));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            status: false,
            message: 'Internal error..!' }));
    }
};