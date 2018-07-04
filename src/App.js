import Express from 'express';
import cors from'cors';
import BodyParser from 'body-parser';
import InitModels from './models/__init__';
import InitServices from './services/__init__';
import InitRoutes from './routes/__init__';

const App = Express();

// Set CORS
const originList = [
    'http://localhost:3000',
    'https://anpaul0615.github.io',
    'https://anpaul0615.github.io/profile-chat-pwa',
    'https://profile-chat-pwa.anpaul0615.com'
];
App.use(cors({
    origin: (origin, callback)=>{
        if (originList.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: [ 'GET', 'PUT', 'POST', 'DELETE' ],
    exposedHeaders: [
        'Accept',
        'Authorization',
        'Content-Type',
        'If-None-Match'
    ],
    credentials: true
}));


// Set Middleware
App.use(BodyParser.urlencoded({
    extended: true
}));
App.use(BodyParser.json());

// Set Models
const models = InitModels();

// Set Services
const services = InitServices();

// Set Router
const { AuthRoute, MessageRoute } = InitRoutes(models, services);
App.use(function(req, res, next){
    if(process.env.NODE_ENV === 'development'){
        console.log('req.body :: ', req.body);
        console.log('req.cookies :: ', req.cookies);
        console.log('req.session :: ', req.session);
    }
    next();
});
App.use('/auth', AuthRoute);
App.use('/message', MessageRoute);
App.get('/', (req,res,next)=>{
    const info = {
        message: 'profile-chat-api (v1.0)',
        data: null
    };
    res.json(info);
});

// 500 handler
App.use(function(err, req, res, next) {
    console.log('============================');
    console.log(['[500] => ', req.protocol, req.method, req.originalUrl].join(' '));
    console.log('============================');
    console.log(err.stack);
    res.status(500).json({ message: err.message || '[500] Internel Server Error..!' });
});
// 404 handler
App.use(function(req, res, next) {
    console.log('============================');
    console.log(['[404] => ', req.protocol, req.method, req.originalUrl].join(' '));
    console.log('============================');
    res.status(404).json({ message: '[404] Resource Not Found' });
});

console.log('[App] Init OK!!');
export default App;