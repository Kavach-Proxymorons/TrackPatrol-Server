import Shift from '../models/Shift.js';

const getAssignedDuties = async (req, res, next) => {
    const { personnel_id } = req.user;
    const { page, limit, start_time, end_time } = req.query;

    try {
        console.log(personnel_id);
        const query = {
            'personnel_assigned.personnel': personnel_id
        };

        query.start_time = {
            $gte: new Date()
        };

        if (start_time && end_time) {
            query.start_time = {
                $gte: start_time,
                $lte: end_time
            };
        }

        const shifts = await Shift.find(query)
            .populate({
                path: 'duty',
                select: 'title description venue location note'
            })
            .select('-hardwares_attached -personnel_assigned')
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .sort({ start_time: 'asc' })
            .exec();
        
        const count = await Shift.countDocuments(query);

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Shifts fetched successfully',
            data: {
                shifts,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            }
        });


    } catch (err) {
        console.log(err);
        next();
    }
}

const getShiftDetails = async (req, res, next) => {
    const { shift_id } = req.params;

    try {
        const shift = await Shift.findById(shift_id)
            .populate({
                path: 'duty',
                select: 'title description venue location note'
            })
            .select('-hardwares_attached -personnel_assigned')
            .exec();

        if (!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Shift fetched successfully',
            data: shift
        });
    } catch (err) {
        next(err);
    }
}

export {
    getAssignedDuties,
    getShiftDetails
}