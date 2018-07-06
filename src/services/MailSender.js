import CONFIG from '../../conf/aws.conf.json';
import AWS from 'aws-sdk';

export default function() {

    /* Init Access Configuration */
    AWS.config.update({
        accessKeyId: CONFIG.accessKeyId,
        secretAccessKey: CONFIG.secretAccessKey,
        region: CONFIG.ses.region,
        endpoint: CONFIG.ses.endpoint,
    });
    
    /* Create SES Object */
    const sesClient = new AWS.SES({ apiVersion: '2010-12-01' });
    
    /* Define Class */
    function MailSender(){};
    MailSender.prototype.sesClient = sesClient;
    MailSender.prototype.sesParamTemplate = {
        Destination: {
            ToAddresses: []
        },
        Message: {
            Subject: {
                Charset: 'UTF-8',
                Data: 'Your Access Code Is Registered :)'
            },
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: null
                }
            }
        },
        Source: CONFIG.ses.source
    };
    /* Define Class Method */
    MailSender.prototype.send = function(userInfo){
        if (!userInfo) {
            return reject(new Error('Missing User-Info..!'));
        }
        const { userAccessCode, userName, userContact } = userInfo;
        const params = this.sesParamTemplate;
        params.Destination.ToAddresses = [ userContact ];
        params.Message.Body.Text.Data = `
        Your Access Code Is Registered.
        Here Are User Data of You.
        
        Access Code : ${userAccessCode}
        Name : ${userName}
        Contact : ${userContact}

        Thanks to Your Registration.
        `;
        
        return this.sesClient.sendEmail(params).promise();
    }
    
    
    console.log('[services.MailSender] Init ok!!');
    return new MailSender();
}