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
    
}