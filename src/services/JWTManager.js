import CONFIG from '../../conf/jwt.conf.json';
import JWT from 'jsonwebtoken';

export default function() {
    
    /* Define Class */
    function JWTManager(){};
    JWTManager.prototype.jwt = JWT;
    JWTManager.prototype.config = CONFIG;
    
    /* Define Class Method */
    JWTManager.prototype.create = function(data){
        return new Promise((resolve,reject)=>{
            if (!data) {
                return reject(new Error('Missing JWT-Data..!'));
            }

            const { secret, signOption } = this.config;

            this.jwt.sign(data, secret, signOption, (err,token)=>{
                if(err) reject(err);
                else resolve(token);
            });
        });
    }
    JWTManager.prototype.verify = function(token){
        return new Promise((resolve,reject)=>{
            if (!token) {
                return reject(new Error('Missing JWT-Token..!'));
            }

            const { secret, verifyOption } = this.config;

            this.jwt.verify(token, secret, verifyOption, (err,decoded)=>{
                if(err) reject(err);
                else resolve(decoded);
            });
        });
    }
    
    
    console.log('[services.JWTManager] Init ok!!');
    return new JWTManager();
};