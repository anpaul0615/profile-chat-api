import * as response from '../helpers/response';

/**
 * Get API Information
 * 
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export const handler = (event, context, callback)=>{
    return callback(null, response.success({
        message: 'profile-chat-api v1.0' }));
};