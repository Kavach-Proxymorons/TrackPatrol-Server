import mongoose from 'mongoose';

const dutySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    venue:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    start_time:{
        type: Date,
        required: true
    },
    end_time:{
        type: Date,
        required: true
    },
    note:{
        type: String,
        required: true
    },
    shifts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shift'
        }
    ],
});

const Duty = mongoose.model('Duty', dutySchema);

export default Duty;