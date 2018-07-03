import Express from 'express';

export default function(models, services){
    const Router = Express.Router();
    
    /**
     * HTTP GET ~/message
     */
    Router.get('/', (req,res,next)=>{

        // 1) get chat-history
        // todo

        // 2) response
        
        console.log('[routes.Message] HTTP GET /message :: OK!!');
        res.json({
            message: 'HTTP GET /message :: OK!!',
            data: null
        });
    });
    /**
     * HTTP POST ~/message
     */
    Router.post('/', (req,res,next)=>{
    
        // 1) recv chat-message
        // todo

        // 2) save chat-message to ddb
        // todo

        // 3) response
        
        console.log('[routes.Message] HTTP POST /message :: OK!!');
        res.json({
            message: 'HTTP POST /message :: OK!!',
            data: null
        });
    });

    
    console.log('[routes.Message] Init OK!!');
    return Router;
};