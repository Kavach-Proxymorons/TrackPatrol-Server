import mongoose from 'mongoose';

const personnelSchema = new mongoose.Schema({
    sid: {
        type: String,
        required: true,
        unique: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    official_name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    photograph: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    blood_group: {
        type: String,
        required: true
    },
    identification_mark: {
        type: String,
        required: true
    },
    posted_at: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

personnelSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        const err = new Error('sid already exists');
        err.status = 409;
        next(err);
    } else {
        next(error);
    }
});

const Personnel = mongoose.model('Personnel', personnelSchema);

export default Personnel;