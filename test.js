import App from './src/App';

App.listen(3000, function(err){
    if(err) console.log(err);
    else console.log('[test.js] Listen 3000 OK!!');
});