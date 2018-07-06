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
            const accessCode = req.get('accessCode');
            if(!accessCode) {
                return res.status(400).json({
                    message: 'HTTP GET /auth/users :: Missing access-code..!',
                    data: null
                });
            }

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
    /**
     * HTTP POST ~/auth/users
     */
    Router.post('/users', async (req,res,next)=>{
        const { JWTManager, MailSender } = services;
        const { User } = await models;

        // 1) recv user-name, user-contact
        const { userName, userContact } = req.body;

        try {
            // 2) create jwt-token by user-name, user-contact
            const userAccessCode = await JWTManager.create({ userName, userContact });

            // 3) find userInfo by jwtToken
            const { data } = await User.getUserByAccessCode(userAccessCode);

            // 3-1) if exist, response 400 (already registered)
            if(data.Item) {
                return res.status(400).json({
                    message: 'HTTP POST /auth/users :: Already registered..!',
                    data: {
                        userAccessCode, userName, userContact
                    }
                });

            // 3-2) else, add new-user + send email + response 201 (created)
            } else {
                await User.addUser({ userAccessCode, userName, userContact });
                await MailSender.send({ userAccessCode, userName, userContact });
                return res.status(201).json({
                    message: 'HTTP GET /auth/users :: Created!!',
                    data: null
                });
            }

        } catch(e) {
            return next( new Error(e) );
        }
    });


    console.log('[routes.Auth] Init OK!!');
    return Router;
};