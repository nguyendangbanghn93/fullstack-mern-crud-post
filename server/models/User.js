const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

},
    { timestamps: true }
);
//Tên bảng
module.exports = mongoose.model('users', UserSchema);