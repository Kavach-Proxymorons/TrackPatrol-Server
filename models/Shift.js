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
    start_time: {
        type: Date,
        required: true
    },
    issue_reported: [
        {
            issue_category : {
                type: String,
            },
            issue_description : {
                type: String,
            },
        }
    ],
    distance_radius: {
        type: Number, // in meters by default it is 250 meters.
        default: 250
    },
    end_time: {
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
            status: {
                type: String,
                enum: ['pending', 'started', 'paused', 'completed'],
                default: 'pending'
            },
            starting_time: {
                type: Date
            },
            ending_time: {
                type: Date
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
                    },
                    distance_from_duty_location: {
                        type: Number,
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