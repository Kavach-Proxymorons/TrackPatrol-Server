import Hardware from '../models/Hardware.js';

const hardwareRegisterController = async (req, res, next) => {
    try{
        const { hardware_id, secret, name, description, type, status } = req.body;

        // Create a new hardware
        const newHardware = new Hardware({
            hardware_id,
            secret,
            name,
            description,
            type,
            status
        });

        // Save the hardware
        await newHardware.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Hardware registered successfully',
            data: newHardware
        });
    } catch(error) {
        next(error);
    }
}   

const fetchAllHardwareController = async (req, res, next) => {
    try{
        const { page, limit } = req.query;

        // Find all the hardware
        const hardware = await Hardware.find()
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .exec();

        const count = await Hardware.countDocuments();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Hardware fetched successfully',
            data: {
                hardware,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            }
        });
    } catch(error){
        next(error);
    }
}

export {
    hardwareRegisterController,
    fetchAllHardwareController,
};