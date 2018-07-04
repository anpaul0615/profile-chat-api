import awsServerlessExpress from 'aws-serverless-express';
import App from './App';

const Server = awsServerlessExpress.createServer(App);

console.log('[RootHandler] Init OK!!');
export default (event, context)=>{
    /** Immediate response for WarmUP plugin */
    if (event.source === 'serverless-plugin-warmup') {
        console.log('[RootHandler] warmup ok!!');
        return callback(null, 'RootHandler is warm!!');
    }
    
    return awsServerlessExpress.proxy(Server, event, context);
}