module.exports = mongoose => {
    let esquema = new mongoose.Schema({
        email: String,
        name: String,
        user: String,
        password: String,
        token: String,

        rol: String,

        permisos: [String]
    });

    return mongoose.model('Users',esquema);
}