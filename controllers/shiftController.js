import Shift from '../models/Shift.js';

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

export {
    createShift
}