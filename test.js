import App from './src/App';

App.listen(5000, function(err){
    if(err) console.log(err);
    else console.log('[test.js] Listen 5000 OK!!');
});