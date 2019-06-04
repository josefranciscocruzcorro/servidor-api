module.exports = (User,permisos = []) => {
    return (req,res,next) => {
        User.findOne({
            user: req.header("user"),
            $or: [
                {
                    permisos: {
                        $all: permisos
                    }
                },
                {
                    rol: "Super Usuario"
                }
            ]
        },function(err, usuario) {
            if (err)
                res.send(err);
            if (usuario) {
                next();
            }else{
                res.json({
                    msg_servidor: 'No Tienes Permiso.'
                });
            }
        })
    }
}