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
            status: false,
            message: 'Missing body data..! ' }));
    }
    const bodyData = bodyParser.toObject(bodyDataString);
    if (typeof(bodyData) !== 'object') {
        return callback(null, response.badRequest({
            status: false,
            message: 'Invalid body data..! ' }));
    }
    const { groupname, groupNickname, userList } = bodyData;
    if (!groupname) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing groupname..! ' }));
    }
    if (!userList) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing userList..! ' }));
    }
    if (userList.length === 0) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Empty userList..! ' }));
    }

    // Create New Message Group
    try {
        const putParams = {
            TableName: 'profile-chat.MessageGroups',
            Item: {
                "groupname": groupname,
                "groupnickname": groupNickname || groupname,
                "userList": userList
            }
        };
        await dynamodb.call('put', putParams);

        return callback(null, response.success({
            status: true,
            message: `new message-group is created!!`
            }));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            status: false,
            message: 'Internal error..!' }));
    }
};