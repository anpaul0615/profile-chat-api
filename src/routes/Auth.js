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
    /**
     * HTTP GET ~/auth/users
     */
    Router.get('/users', async (req,res,next)=>{
        const { User } = await models;

        try {
            // 1) recv access-code
            const { accessCode } = req.query;

            // 2) find user-data by access-code
            const { data } = await User.getUserByAccessCode(accessCode);
            if(!data.Item) {
                return res.status(404).json({
                    message: 'HTTP GET /auth/users :: Unregistered access-code..!',
                    data: null
                });
            }
            const {
                name: userName,
                contact: userContact
            } = data.Item;

            // 3) response
            return res.json({
                message: 'HTTP GET /auth/users :: OK!!',
                data: {
                    userName,
                    userContact
                }
            });

        } catch(e) {
            return next( new Error(e) );
        }
    });
    

    console.log('[routes.Auth] Init OK!!');
    return Router;
};