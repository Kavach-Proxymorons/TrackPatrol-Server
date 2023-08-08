import Shift from '../models/Shift.js';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    
    const degToRad = (deg) => deg * (Math.PI / 180);

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c; // Distance in kilometers

    return distance*1000;
}

const getAssignedDuties = async (req, res, next) => {
    const { personnel_id } = req.user;
    const { page, limit, start_time, end_time } = req.query;

    try {
        console.log(personnel_id);
        const query = {
            'personnel_assigned.personnel': personnel_id
        };

        query.end_time = {
            $gte: new Date()
        };

        if (start_time && end_time) {
            query.end_time = {
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

const postIssueController = async (req, res, next) => {
    const { shift_id } = req.params;
    const { personnel_id } = req.user;
    const { issue_category, description } = req.body;

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

        shift.issue_reported.push({
            issue_category,
            description,
            reported_by: personnel_id + ""
        });

        await shift.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Issue reported successfully',
            data: {
                issue_category,
                description,
                reported_by: personnel_id + ""
            }
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
        const shift = await Shift.findById(shift_id).populate({ // duty 
            path: 'duty',
            select: 'location'
        }).exec();

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

        // 26.2334,78.2191
        const duty_location_lat = Number(shift.duty.location.split(',')[0]);
        const duty_location_long = Number(shift.duty.location.split(',')[1]);
        const distance = calculateDistance(Number(latitude), Number(longitude), duty_location_lat, duty_location_long);

        shift.personnel_assigned[index].gps_data.push({
            location: `${latitude},${longitude}`,
            timestamp,
            distance_from_duty_location: distance,
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

const bulkPushGpsData = async (req, res, next) => {
    const { shift_id } = req.params;
    const { personnel_id } = req.user;
    const {
        gps_data
    } = req.body;
    const data_to_push = [];
    try {
        const shift = await Shift.findById(shift_id).populate({ // duty
            path: 'duty',
            select: 'location'
        }).exec();

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

        const duty_location_lat = Number(shift.duty.location.split(',')[0]);
        const duty_location_long = Number(shift.duty.location.split(',')[1]);

        // calculate distance for each gps data
        gps_data.forEach(gps_record => {
            const distance = calculateDistance(Number(gps_record.latitude), Number(gps_record.longitude), duty_location_lat, duty_location_long);
            data_to_push.push({
                location: `${gps_record.latitude},${gps_record.longitude}`,
                timestamp: gps_record.timestamp,
                distance_from_duty_location: distance,
            });
        });

        shift.personnel_assigned[index].gps_data.push(...data_to_push);

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
    postIssueController,
    pushGpsData,
    bulkPushGpsData
}