import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    last_login: {
        type: Date,
        default: Date.now
    }
});

authSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        const err = new Error('Username already exists');
        err.status = 409;
        next(err);
    } else {
        next(error);
    }
});

const User = mongoose.model('User', authSchema);

export default User;
