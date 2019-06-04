module.exports = User => {
    return (req,res,next) => {
        User.findOne({user: req.header("user") , token: req.header("token")},function(err, usuario) {
            if (err)
                res.send(err);
            if (usuario) {
                next();
            }else{
                res.json({
                    msg_servidor: 'No estas autorizado.'
                });
            }
        });
    }
}