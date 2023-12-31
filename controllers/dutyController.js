import Duty from '../models/Duty.js';

const createDuty = async (req, res, next) => {
    try {
        const { title, description, venue, location, start_time, end_time, note } = req.body;

        const police_station = req.user.police_station;

        // Create a new duty
        const newDuty = new Duty({
            title,
            description,
            venue,
            location,
            start_time,
            end_time,
            police_station,
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
    } catch (error) {
        next(error);
    }
}

const getDuty = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const police_station = req.user.police_station;

        let query = {};
        if(req.user.role === 'SuperAdmin'){
            query = {};
        } else {
            query = { police_station };
        }

        // Find all the duty with police_station sorted by start_date 
        const duty = await Duty.find(query)
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

    } catch (error) {
        next(error);
    }
}

const getOneDuty = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the duty populate shifts array and personnel and hardwares_attached
        const duty = await Duty.findOne({ _id: id })
            .populate({
                path: 'shifts',
                populate: [
                    {
                        path: 'personnel_assigned.personnel',
                    },
                    {
                        path: 'hardwares_attached',
                    }
                ]
            })
            .exec();

        if (!duty) {
            const err = new Error('Duty not found');
            err.status = 404;
            throw err;
        }

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Duty fetched successfully',
            data: duty
        });
    } catch (error) {
        // catch mongoose cast errors
        if (error.name === 'CastError') {
            const err = new Error('Duty not found');
            err.status = 404;
            next(err);
        }

        next(error);
    }
}

export {
    createDuty,
    getDuty,
    getOneDuty
}