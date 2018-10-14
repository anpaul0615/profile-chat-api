import * as bodyParser from '../../helpers/body-parser';
import * as response from '../../helpers/response';
import * as dynamodb from '../../helpers/dynamodb';

/**
 * HTTP POST /messages/group :: Create New Message Group
 * 
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export const handler = async (event, context, callback)=>{
    /** Immediate response for WarmUP plugin */
    if (event.source === 'serverless-plugin-warmup') {
        console.log('[message-group.create.handler] warmup ok!!');
        return callback(null, 'message-group.create.handler is warm!!');
    }

    // Recieve Body Data
    const bodyDataString = event.body;
    if (!bodyDataString) {
        return callback(null, response.badRequest({
            message: 'Missing body data..! ' }));
    }
    const bodyData = bodyParser.toObject(bodyDataString);
    if (typeof(bodyData) !== 'object') {
        return callback(null, response.badRequest({
            message: 'Invalid body data..! ' }));
    }
    const { groupId, groupName, groupUsers } = bodyData;
    if (!groupId) {
        return callback(null, response.badRequest({
            message: 'Missing groupId..! ' }));
    }
    if (!groupName) {
        return callback(null, response.badRequest({
            message: 'Missing groupName..! ' }));
    }
    if (!groupUsers) {
        return callback(null, response.badRequest({
            message: 'Missing groupUsers..! ' }));
    }
    if (groupUsers.length === 0) {
        return callback(null, response.badRequest({
            message: 'Empty groupUsers..! ' }));
    }

    // Create New Message Group
    try {
        const putParams = {
            TableName: 'profile-chat.MessageGroups',
            Item: {
                "groupId": groupId,
                "groupName": groupName,
                "groupUsers": groupUsers
            }
        };
        await dynamodb.call('put', putParams);

        return callback(null, response.success({
            message: `new message-group is created!!`
            }));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            message: 'Internal error..!' }));
    }
};