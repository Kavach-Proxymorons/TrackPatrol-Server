import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    personnel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personnel'
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

authSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

authSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model('User', authSchema);

export default User;
