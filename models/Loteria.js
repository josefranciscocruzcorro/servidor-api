module.exports = mongoose => {
    let esquema = new mongoose.Schema({
        numero: Number
    });

    return mongoose.model('Loteria',esquema);
}