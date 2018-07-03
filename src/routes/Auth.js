import Express from 'express';

export default function(models, services){
    const Router = Express.Router();
    
    /**
     * HTTP GET ~/auth
     */
    Router.get('/', async (req,res,next)=>{

        // 1) recv access-code
        // todo

        // 2) find user-data by access-code
        // todo

        // 3) response

        console.log('[routes.Auth] HTTP GET /auth :: OK!!');
        res.json({
            message: 'HTTP GET /auth :: OK!!',
            data: null
        });
    });
    

    console.log('[routes.Auth] Init OK!!');
    return Router;
};