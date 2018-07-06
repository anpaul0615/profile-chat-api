import InitMailSender from'../MailSender';
const MailSender = InitMailSender();

/**
 * Generate & Verify Token Test
 */
test.skip('Sendmail', async ()=>{
    const userInfo = {
        userAccessCode: 'u123123',
        userName: 'Paul An',
        userContact: 'anpaul0615@gmail.com'
    };
    
    try {
        // send email
        const result = await MailSender.send(userInfo);
        console.log('result ::', result);
        
    } catch(err) {
        console.log(err);
    }
});