import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
    shift_name: {
        type: String,
        required: true
    },
    duty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Duty'
    },
    start_time:{
        type: Date,
        required: true
    },
    end_time:{
        type: Date,
        required: true
    },
    hardwares_attached: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hardware'
        }
    ],
    personnel_assigned: [
        {
            personnel: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Personnel'
            },
            gps_data: [  // create a new schema for gps_data
                {
                    timestamp: {
                        type: Date,
                        required: true
                    },
                    location: {
                        type: String,
                        required: true
                    }
                }
            ],
            rfid_data: [
                {
                    timestamp: {
                        type: Date,
                        required: true
                    },
                    hardware_id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Hardware'
                    }
                }
            ]
        }
    ]
});

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift;