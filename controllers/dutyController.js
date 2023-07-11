import Duty from '../models/Duty.js'

const createDuty = async (req, res) => {
    try{
        const { title, description, venue, location, start_time, end_time, note } = req.body;

        // Create a new duty
        const newDuty = new Duty({
            title,
            description,
            venue,
            location,
            start_time,
            end_time,
            note
        });

        // Save the duty
        await newDuty.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Duty created successfully',
            data: newDuty
        });
    } catch(error) {
        next(error);
    }
}

export  {
    createDuty
}