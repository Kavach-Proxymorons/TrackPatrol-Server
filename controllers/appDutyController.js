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

const startDuty = async (req, res, next) => {
    const { shift_id,  } = req.params;
    const { personnel_id } = req.user;
    const { time } = req.body;

    try {
        const shift = await Shift.findById(shift_id);
        
        if (!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }

        const index = shift.personnel_assigned.findIndex(personnel => personnel.personnel+"" == personnel_id);

        if (index == -1) {
            const err = new Error('Personnel not assigned to shift');
            err.status = 404;
            throw err;
        }

        shift.personnel_assigned[index].starting_time = time;
        shift.personnel_assigned[index].status = 'started';

        await shift.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Shift started successfully',
            data: {}
        });

    } catch (err) {
        next(err);
    }
}

const stopDuty = async (req, res, next) => {
    const { shift_id } = req.params;
    const { personnel_id } = req.user;
    const { time } = req.body;

    try {
        const shift = await Shift.findById(shift_id);

        if (!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }

        const index = shift.personnel_assigned.findIndex(personnel => personnel.personnel+"" == personnel_id);

        if (index == -1) {
            const err = new Error('Personnel not assigned to shift');
            err.status = 404;
            throw err;
        }

        shift.personnel_assigned[index].ending_time = time;
        shift.personnel_assigned[index].status = 'completed';

        await shift.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Shift stopped successfully',
            data: {}
        });

    } catch (err) {
        next(err);
    }
}

const pushGpsData = async (req, res, next) => {
    const { shift_id } = req.params;
    const { personnel_id } = req.user;
    const {
        latitude,
        longitude,
        timestamp,
    } = req.body;
    try {
        const shift = await Shift.findById(shift_id);

        if (!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }

        const index = shift.personnel_assigned.findIndex(personnel => personnel.personnel+"" == personnel_id);

        if (index == -1) {
            const err = new Error('Personnel not assigned to shift');
            err.status = 404;
            throw err;
        }

        // if duty is stopped or pending
        if(shift.personnel_assigned[index].status == "stopped"){
            const err = new Error('Duty already stopped');
            err.status = 400;
            throw err; 
        }

        if(shift.personnel_assigned[index].status == "pending"){
            const err = new Error('Duty not started yet.');
            err.status = 400;
            throw err; 
        }

        shift.personnel_assigned[index].gps_data.push({
            location: `${latitude},${longitude}`,
            timestamp
        });

        await shift.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'GPS data pushed successfully',
            data: {}
        });

    } catch (err) {
        next(err);
    }
}

export {
    getAssignedDuties,
    getShiftDetails,
    startDuty,
    stopDuty,
    pushGpsData
}