import Duty from '../models/Duty.js';

const createDuty = async (req, res, next) => {
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

const getDuty = async(req, res, next) => {
    try{
        const { page, limit } = req.query;

        // Find all the duty sorted by start_date 
        const duty = await Duty.find()
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .sort({ start_time: 'asc' })
            .exec();

        const count = await Duty.countDocuments();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Duty fetched successfully',
            data: {
                duty,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            }
        });
        
    } catch(error){
        next(error);
    }
}

export  {
    createDuty, 
    getDuty
}