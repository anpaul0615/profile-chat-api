import InitJWTManager from './JWTManager';
import InitMailSender from './MailSender';

export default function() {
    const Services = {
        JWTManager: InitJWTManager(),
        MailSender: InitMailSender()
    };
    
    return Services;
}