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
        const { personnel_id } = req.body;

        // Find the shift
        const shift = await Shift.findOne({ _id: id });

        if(!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }

        // Find the personnel
        const personnel = await Personnel.findOne({ _id: personnel_id });

        if(!personnel) { // To-do to check if personnel has already been assigned to shift
            const err = new Error('Personnel not found');
            err.status = 404;
            throw err;
        }

        // Add personnel to shift
        shift.personnel_assigned.push({
            personnel : personnel._id
        });

        // Save the shift
        await shift.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel added to shift successfully',
            data: shift
        });

    } catch (error) {
        next(error);
    }
}


export {
    createShift,
    deleteShift,
    addPersonnelToShift,
}