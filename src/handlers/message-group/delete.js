import * as bodyParser from '../../helpers/body-parser';
import * as response from '../../helpers/response';
import * as dynamodb from '../../helpers/dynamodb';

/**
 * HTTP DELETE /messages/group :: Delete Message Group
 * 
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export const handler = async (event, context, callback)=>{
    /** Immediate response for WarmUP plugin */
    if (event.source === 'serverless-plugin-warmup') {
        console.log('[message-group.delete.handler] warmup ok!!');
        return callback(null, 'message-group.delete.handler is warm!!');
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
    const { groupname } = bodyData;
    if (!groupname) {
        return callback(null, response.badRequest({
            status: false,
            message: 'Missing groupname..! ' }));
    }

    // Delete Message Group
    try {
        const deleteParams = {
            TableName: 'profile-chat.MessageGroups',
            Key:{
                'groupname': groupname
            }
        };
        await dynamodb.call('delete', deleteParams);

        return callback(null, response.success({
            status: true,
            message: `message-group is deleted!!`
            }));

    } catch (e) {
        console.log(e);
        return callback(null, response.failure({
            status: false,
            message: 'Internal error..!' }));
    }
};