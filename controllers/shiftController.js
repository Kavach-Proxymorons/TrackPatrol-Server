import Shift from '../models/Shift.js';
import Personnel from '../models/Personnel.js';

const createShift = async (req, res, next) => {
    try {
        const {
            shift_name,
            duty,
            start_time,
            end_time
        } = req.body;

        // Create a new shift
        const newShift = new Shift({
            shift_name,
            duty,
            start_time,
            end_time
        });

        // Save the shift
        await newShift.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Shift created successfully',
            data: newShift
        });

    } catch (error) {
        next(error);
    }
}

const deleteShift = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the shift
        const shift = await Shift.deleteOne({ _id: id });

        if(shift.deletedCount < 1) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        } 

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Shift deleted successfully',
            data: shift
        });

    } catch (error) {
        next(error);
    }
}

const addPersonnelToShift = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { personnel_array } = req.body;

        // Find the shift
        const shift = await Shift.findOne({ _id: id });

        if(!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }

        // Find the personnel
        // check if all personnel exist
        const personnel = await Personnel.find({ _id: { $in: personnel_array } });

        if(personnel.length < 1 ) {
            const err = new Error('No Personnel found/added');
            err.status = 404;
            throw err;
        }

        const found_personnel_ids = personnel.map(p => p._id+"");
        const not_found_personnel_ids = personnel_array.filter(p => !found_personnel_ids.includes(p));

        // Add personnel to shift
        for(let i = 0; i < found_personnel_ids.length; i++) {
            shift.personnel_assigned.push({
                personnel: found_personnel_ids[i]
            })
        }

        // Save the shift
        await shift.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel added to shift successfully',
            data: {
                personnel_added: found_personnel_ids,
                personnel_not_added: not_found_personnel_ids
            }
        });

    } catch (error) {
        next(error);
    }
}

const removePersonnelFromShift = async (req, res, next) => {
    try {
        /*
        
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
}
        */
        const { id } = req.params;
        const { personnel_array } = req.body;

        // Find the shift
        const shift = await Shift.findOne({ _id: id });

        if(!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }


        const to_remove_personnels = shift.personnel_assigned.filter(p => personnel_array.includes(p.personnel+""));
        shift.personnel_assigned = shift.personnel_assigned.filter(p => !personnel_array.includes(p.personnel+""));
        
        const removed_personnels_ids = to_remove_personnels.map(p => p.personnel+"");
        const not_removed_personnel_ids = personnel_array.filter(p => !removed_personnels_ids.includes(p));

        // Save the shift
        await shift.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel removed from shift successfully',
            data: {
                personnel_removed: removed_personnels_ids,
                personnel_not_removed: not_removed_personnel_ids
            }
        });

    } catch (error) {
        next(error);
    }
}



export {
    createShift,
    deleteShift,
    addPersonnelToShift,
    removePersonnelFromShift
}