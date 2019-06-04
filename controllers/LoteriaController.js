const verificarToken = require('../middlewares/verificarToken');//Verifica que sea un usuario autentico
const permisosUser = require('../middlewares/permisosUser');

module.exports = (app,Loteria,User) => {

    app.get('/api/loteria',(req,res) => {
        Loteria.find({},"numero",function(err,numeros){
            if (err)
                res.send(err);

            res.json(numeros);
        });
    });

    app.post('/api/loteria',verificarToken(User),permisosUser(User,["Agregar Loteria"]),(req,res)=>{
        if(!req.body.numero || req.body.numero.length != 6)
            res.json({
                msg_servidor: 'Ingrese un numero de 6 digitos.'
            });

        Loteria.create({
            numero: req.body.numero
        },function(err,loteria) {
            if(err)
                res.send(err);
            res.json({
                msg_servidor_success: 'Numero agregado'
            });
        });
    });
    
}