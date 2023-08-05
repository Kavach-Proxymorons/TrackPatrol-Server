import Hardware from '../models/Hardware.js';
import Shift from '../models/Shift.js';

const pushDataController = async (req, res, next) => {
    /*
    {
        "hardware_id": "123",
        "secret": "123456789",
        "timestamp": "2023-07-18T04:18:00.000+05:30",
        "data": "64b580ecce6f2178b5a5c963"
    }
    */

    const { hardware_id, secret, timestamp, data } = req.body;
    // data is the personnel_id

    try {
        // find hardware
        const hardware = await Hardware.findOne({ hardware_id });

        if (!hardware) {
            const err = new Error('Hardware not found');
            err.status = 404;
            throw err;
        }

        // check secret
        if (hardware.secret != secret) {
            const err = new Error('Secret mismatch');
            err.status = 401;
            throw err;
        }

        // each hardware has a field attached_to_shift with value as shift_id | null
        const attached_to_shift = hardware.attached_to_shift;

        // check if hardware is attached to any shift
        if (!attached_to_shift) {
            const err = new Error('Hardware not attached to any shift');
            err.status = 400;
            throw err;
        }

        // find shift
        const shift = await Shift.findById(attached_to_shift);

        if (!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }

        // check if personnel is assigned to shift
        const index = shift.personnel_assigned.findIndex(personnel => personnel.personnel+"" == data);

        if (index == -1) {
            const err = new Error('Personnel not assigned to shift');
            err.status = 404;
            throw err;
        }

        // update shift
        shift.personnel_assigned[index].rfid_data.push({
            timestamp,
            hardware_id: hardware._id,
        });

        await shift.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Data pushed successfully',
            data: {}
        });

    } catch (err) {
        next(err);
    }
}

export {
    pushDataController
}