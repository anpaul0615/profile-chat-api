import InitAuthRoute from './Auth';
import InitMessageRoute from './Message';

export default function(models, services) {
    const Routes = {
        AuthRoute: InitAuthRoute(models, services),
        MessageRoute: InitMessageRoute(models, services)
    };
    
    return Routes;
}