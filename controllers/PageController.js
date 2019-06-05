const transporter = require('../config/mail');

module.exports = (app,User) => {

    app.post('/api/contacto',(req,res) => {
        transporter.sendMail({
            from: 'info@jc-desarrollos.com',
            to: 'admin@jc-desarrollos.com',
            subject: 'Alguien te ha Contactado.',
            html: `
                <center><h1><strong>Datos de Contacto</strong></h1></center>
                <br>
                <p><strong>Mensaje:</strong>"`+req.body.mensaje+`"</p>
                <br>
                <table>
                <tr><td><strong>Asunto:</strong></td><td>`+ req.body.asunto +`</td></tr>
                <tr><td><strong>Email del contacto:</strong></td><td>`+ req.body.email +`</td></tr>
                </table>
            `
        },function(err,info) {
            if(err)
                res.send(err);
            res.json({
                msg_servidor_success: 'Mensaje de contacto enviado.'
            });
        })
    });

}