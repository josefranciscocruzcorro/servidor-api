const md5 = require('md5');
const verificarToken = require('../middlewares/verificarToken');//Verifica que sea un usuario autentico
const permisosUser = require('../middlewares/permisosUser');//Verifica que posee los permisos que se solicitan
const transporter = require('../config/mail');

module.exports = (app,User) => {
    
    app.get('/api/users', verificarToken(User),permisosUser(User,["Ver Usuarios"]),(req,res) => {
        User.find({},"_id user email name rol permisos",function(err,usuarios){
            if (err)
                res.send(err);

            res.json(usuarios);
        });
    });
    
    app.put('/api/users/:id',verificarToken(User),permisosUser(User,["Editar Usuarios"]),(req,res)=>{
        User.findById(req.params.id,"_id user email name rol permisos",function(err,usuario) {
            if (err)
                res.send(err);
            
            if (usuario) {
                if (req.body.email) {
                    usuario.email = req.body.email;
                }
                if (req.body.name) {
                    usuario.name = req.body.name;
                }
                if (req.body.password) {
                    usuario.password = md5(req.body.password);
                }
                if (req.body.rol && usuario.rol != "Super Usuario" && req.body.rol != "Super Usuario") {
                    usuario.rol = req.body.rol;
                }
                if (req.body.permisos) {
                    usuario.permisos = req.body.permisos;
                }       
                usuario.save((e)=>{
                    if (e)
                        res.send(e);
                    res.json(usuario);
                })
            }else{
                res.json({
                    msg_servidor: 'Ese Usuario no Existe.'
                });
            }

        });
    });    

    app.delete('/api/users/:id',verificarToken(User),permisosUser(User,["Eliminar Usuarios"]),(req,res)=>{
        User.findById(req.params.id,function(err,usuario) {
            if (err)
                res.send(err);
            
            if (usuario) {
                if (usuario.rol == "Super Usuario") {
                    res.json({
                        msg_servidor: 'Ese Usuario no puede ser Eliminado.'
                    });
                }else{
                    User.findByIdAndDelete(req.params.id,function(e){
                        if (e)
                            res.send(e);
                        res.json({
                            msg_servidor_success: 'Usuario Eliminado.'
                        });
                    });  
                }                
            }else{
                res.json({
                    msg_servidor: 'Ese Usuario no Existe.'
                });
            }

        });
    });

    app.post('/api/users',verificarToken(User),permisosUser(User,["Crear Usuarios"]),(req,res) => {
        let fecha = new Date(); 

        let newToken = fecha.getTime()+"";

        User.findOne({user: req.body.user},function(err, usuario) {
            if (err)
                res.send(err);
               
            if(usuario){
                res.json({
                    msg_servidor: 'Ese nombre de Usuario ya esta en uso.'
                });
            }else{
                if (req.body.rol == "Super Usuario") {
                    res.json({
                        msg_servidor: 'Ese rol no puede ser Ocupado por nadie mas.'
                    });
                }else{
                    User.create({
                        email: req.body.email,
                        name: req.body.name,
                        user: req.body.user,
                        password: md5(req.body.password),
                        token: newToken,
                        rol: req.body.rol,
                        permisos: req.body.permisos
                    },function(e,usuario2){
                        if (e) {
                            res.send(e);
                        }
                        res.json({
                            user: req.body.user,
                            token: newToken
                        });
                    });
                }
            }
        });
    });

    app.post('/api/login',(req,res) => {
        let fecha = new Date(); 

        let newToken = fecha.getTime()+"";

        User.findOneAndUpdate({user: req.body.user, password: md5(req.body.password)},{token: newToken},function(err, usuario) {
            if (err)
                res.send(err);
               
            if(usuario){
                res.json({
                    user: usuario.user,
                    token: newToken
                });
            }else{
                res.json({
                    msg_servidor: 'Usuario o Clave Incorrectos.'
                });
            }
        });
    });

    app.post('/api/reset-password',(req,res) => {
        if(!req.body.email)
            res.json({
                msg_servidor: 'El eMail es obligatorio.'
            });

        User.findOne({email: req.body.email, user: req.body.user},function(err,usuario) {
            if(err)
                res.send(err);
            if (usuario) {
                let fecha = new Date(); 

                let newToken = fecha.getTime()+"";

                transporter.sendMail({
                    from: 'info@jc-desarrollos.com',
                    to: req.body.email,
                    subject: 'Datos de ingreso.',
                    html: `
                        <center><h1><strong>Datos de Ingreso</strong></h1></center>
                        <br>
                        <p>Ingrese al sistema con los siguientes datos provicionales, despues podra cambiar su clave</p>
                        <br>
                        <table>
                        <tr><td><strong>Usuario:</strong></td><td>`+ req.body.user +`</td></tr>
                        <tr><td><strong>Clave:</strong></td><td>`+ newToken +`</td></tr>
                    `
                },function(err,info) {
                    if(err)
                        res.send(err);
                    res.json({
                        msg_servidor_success: 'Los datos provicionales de ingreso fueron enviados a su correo.'
                    });
                })
            } else {
                res.json({
                    msg_servidor: 'Esos datos no existen en nuestros registros.'
                });
            }
        });
    });

    app.post('/api/perfil',verificarToken(User),(req,res)=>{
        User.findOne({user: req.header("user") , token: req.header("token")},"_id user email name rol permisos",function(err,usuario) {
            if (err)
                res.send(err);
            
            if (usuario) {
                if (req.body.email) {
                    usuario.email = req.body.email;
                }
                if (req.body.name) {
                    usuario.name = req.body.name;
                }
                if (req.body.password) {
                    usuario.password = md5(req.body.password);
                }
                usuario.save((e)=>{
                    if (e)
                        res.send(e);
                    res.json(usuario);
                })
            }else{
                res.json({
                    msg_servidor: 'Ese Usuario no Existe.'
                });
            }

        });
    });

}