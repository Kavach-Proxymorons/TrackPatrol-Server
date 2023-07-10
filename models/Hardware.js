import mongoose from 'mongoose';

const hardwareSchema = new mongoose.Schema({
    hardware_id: {
        type: String,
        required: true,
        unique: true
    },
    secret: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    attached_To_duty:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Duty'
    },
    status:{
        type: String,
        required: true
    }
});

hardwareSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        const err = new Error('hardware_id already exists');
        err.status = 409;
        next(err);
    } else {
        next(error);
    }
});

const Hardware = mongoose.model('Hardware', hardwareSchema);

export default Hardware;
