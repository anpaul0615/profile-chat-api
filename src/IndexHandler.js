export default (event, context, callback)=>{
    /** Immediate response for WarmUP plugin */
    if (event.source === 'serverless-plugin-warmup') {
        console.log('[IndexHandler] warmup ok!!');
        return callback(null, 'IndexHandler is warm!!');
    }

    const response = {
        message: 'profile-chat-api (v1.0)',
        data: null
    };
    console.log('[IndexHandler] HTTP GET / :: ok!!');
    return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response)
    });
};