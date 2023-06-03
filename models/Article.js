const mongoose = require('mongoose');
const LinkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title : {
        type: String,
        required: true,
    },
    description : {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('articles', LinkSchema)