import Shift from '../models/Shift.js';
import Hardware from '../models/Hardware.js'
import Duty from '../models/Duty.js';
import Personnel from '../models/Personnel.js';

const calculateDistance = (lat1, lon1, lat2, lon2) => { // To Do Move to utils
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

    return distance * 1000;
}

const createShift = async (req, res, next) => {
    try {
        const {
            shift_name,
            duty,
            start_time,
            end_time,
            distance_radius,
        } = req.body;

        // Create a new shift
        const newShift = new Shift({
            shift_name,
            duty,
            start_time,
            end_time,
            distance_radius,
        });

        // Find the duty
        const found_duty = await Duty.findOne({ _id: duty });

        if (!found_duty) {
            const err = new Error('Duty not found');
            err.status = 404;
            throw err;
        }

        // Attach the shift to the duty
        found_duty.shifts.push(newShift._id);

        // Save the shift
        await newShift.save();

        // Save the duty
        await found_duty.save();

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

const getOngoingShifts = async (req, res, next) => {
    try {
        // ongoing duty is a duty whose start_time is less than or equal to the current time and end_time is greater than or equal to the current time
        const ongoingShifts = await Shift.find({
            start_time: {
                $lte: new Date()
            },
            end_time: {
                $gte: new Date()
            }
        })
            .populate({
                path: 'duty',
                select: '-shifts'
            })
            .select('-hardwares_attached -personnel_assigned -__v')
            .exec();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Ongoing shifts fetched successfully',
            data: ongoingShifts
        });
    } catch (error) {
        next(error);
    }
}

const getOneShift = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the shift
        const shift = await Shift.findOne({ _id: id })
            .populate({
                path: 'personnel_assigned.personnel',
                model: 'Personnel'
            })
            .populate({
                path: 'hardwares_attached',
                model: 'Hardware'
            })
            .populate({
                path: 'duty',
                select: '-shifts'
            })
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

    } catch (error) {
        next(error);
    }
}

const deleteShift = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the shift
        const shift = await Shift.deleteOne({ _id: id });

        if (shift.deletedCount < 1) {
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
        const { personnel_array } = req.body;
        const all_personnel = await Personnel.find({});

        const personnel_id_to_sid_map = {};
        
        all_personnel.forEach(p => {
            personnel_id_to_sid_map[p._id] = p.sid;
        });

        // Find the shift
        const shift = await Shift.findOne({ _id: id });
        const selected_shift_start_time = shift.start_time;
        const selected_shift_end_time = shift.end_time;

        if (!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }

        // Find the personnel
        // check if all personnel exist
        const personnel = await Personnel.find({ _id: { $in: personnel_array } });

        if (personnel.length < 1) {
            const err = new Error('No Personnel found/added');
            err.status = 404;
            throw err;
        }

        const found_personnel_ids = personnel.map(p => p._id + "");
        const not_found_personnel_ids = personnel_array.filter(p => !found_personnel_ids.includes(p));

        const not_added_because_clashing_shifts = [];

        // Add personnel to shift
        for (let i = 0; i < found_personnel_ids.length; i++) {
            // if not already added
            if (shift.personnel_assigned.filter(p => p.personnel == found_personnel_ids[i]).length > 0) {
                continue;
            }

            // s1_start < s2_end and s2_start < s1_end
            const clashing_shifts = await Shift.find({
                $or: [
                  { start_time: { $lt: selected_shift_end_time }, end_time: { $gt: selected_shift_start_time } },
                  { start_time: { $gte: selected_shift_start_time, $lt: selected_shift_end_time } },
                  { end_time: { $gt: selected_shift_start_time, $lte: selected_shift_end_time } }
                ]
              });
            
            clashing_shifts.forEach(clashing_shift => {
                if(clashing_shift.personnel_assigned.filter(p => p.personnel == found_personnel_ids[i]).length > 0) {
                    not_added_because_clashing_shifts.push({
                        personnel : found_personnel_ids[i],
                        shift: clashing_shift._id+"",
                        clashing_duty_id: clashing_shift.duty+"",
                        shift_name : clashing_shift.shift_name
                    });
                }
            })

            // check if found_personnel_ids[i] is not in not_added_because_clashing_shifts
            if(not_added_because_clashing_shifts.filter(p => p.personnel == found_personnel_ids[i]).length > 0) {
                continue;
            } 

            shift.personnel_assigned.push({
                personnel: found_personnel_ids[i]
            })
        }

        // Save the shift
        await shift.save();
        const sid_added = found_personnel_ids.map(p => personnel_id_to_sid_map[p]);
        const sid_not_added = not_found_personnel_ids.map(p => personnel_id_to_sid_map[p]);
        const sid_not_added_because_clashing_shifts = not_added_because_clashing_shifts.map(p => {
            return {
                sid: personnel_id_to_sid_map[p.personnel+""],
                clashing_shift_name: p.shift_name,
                clashing_shift_duty: p.clashing_duty_id+""
            }
        });

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel added to shift successfully',
            data: {
                sid_added,
                sid_not_added,
                sid_not_added_because_clashing_shifts,
            }
        });

    } catch (error) {
        next(error);
    }
}

const addHardwareToShift = async (req, res, next) => {
    try {
        const { id } = req.params; // shift_id
        const { hardware_array } = req.body;

        // Find the shift
        const shift = await Shift.findOne({ _id: id });

        if (!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }

        // Find the hardware
        // check if all hardware exist
        const hardware = await Hardware.find({ _id: { $in: hardware_array } });

        if (hardware.length < 1) {
            const err = new Error('No hardware found/added');
            err.status = 404;
            throw err;
        }

        // filter out all hardwares with status occupied
        const unoccupied_hardware = hardware.filter(h => h.status == 'idle');
        const found_hardware_ids = unoccupied_hardware.map(p => p._id + "");

        const not_found_hardware_ids = hardware_array.filter(p => !found_hardware_ids.includes(p));

        // Add hardware to shift
        for (let i = 0; i < found_hardware_ids.length; i++) {
            // if not already added
            if (!shift.hardwares_attached.includes(found_hardware_ids[i]))
                shift.hardwares_attached.push(found_hardware_ids[i])
        }

        // Save the shift
        await shift.save();

        // update status of hardware to 'occupied'
        await Hardware.updateMany({ _id: { $in: found_hardware_ids } }, { status: 'occupied' });

        // update attached_to_shift
        await Hardware.updateMany({ _id: { $in: found_hardware_ids } }, { attached_to_shift: id });

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Hardware added to shift successfully',
            data: {
                hardware_added: found_hardware_ids,
                hardware_not_added: not_found_hardware_ids
            }
        });

    } catch (error) {
        next(error);
    }
}

const removePersonnelFromShift = async (req, res, next) => {
    try {
        /*
        
    shift_name: {
        type: String,
        required: true
    },
    duty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Duty'
    },
    start_time:{
        type: Date,
        required: true
    },
    end_time:{
        type: Date,
        required: true
    },
    hardwares_attached: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hardware'
        }
    ],
    personnel_assigned: [
        {
            personnel: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Personnel'
            },
            gps_data: [  // create a new schema for gps_data
                {
                    timestamp: {
                        type: Date,
                        required: true
                    },
                    location: {
                        type: String,
                        required: true
                    }
                }
            ],
            rfid_data: [
                {
                    timestamp: {
                        type: Date,
                        required: true
                    },
                    hardware_id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Hardware'
                    }
                }
            ]
        }
    ]
}
        */
        const { id } = req.params;
        const { personnel_array } = req.body;

        // Find the shift
        const shift = await Shift.findOne({ _id: id });

        if (!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }


        const to_remove_personnels = shift.personnel_assigned.filter(p => personnel_array.includes(p.personnel + ""));
        shift.personnel_assigned = shift.personnel_assigned.filter(p => !personnel_array.includes(p.personnel + ""));

        const removed_personnels_ids = to_remove_personnels.map(p => p.personnel + "");
        const not_removed_personnel_ids = personnel_array.filter(p => !removed_personnels_ids.includes(p));

        // Save the shift
        await shift.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel removed from shift successfully',
            data: {
                personnel_removed: removed_personnels_ids,
                personnel_not_removed: not_removed_personnel_ids
            }
        });

    } catch (error) {
        next(error);
    }
}

const removeHardwareFromShift = async (req, res, next) => {
    try {
        /*
        
    shift_name: {
        type: String,
        required: true
    },
    duty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Duty'
    },
    start_time:{
        type: Date,
        required: true
    },
    end_time:{
        type: Date,
        required: true
    },
    hardwares_attached: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hardware'
        }
    ],
    personnel_assigned: [
        {
            personnel: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Personnel'
            },
            gps_data: [  // create a new schema for gps_data
                {
                    timestamp: {
                        type: Date,
                        required: true
                    },
                    location: {
                        type: String,
                        required: true
                    }
                }
            ],
            rfid_data: [
                {
                    timestamp: {
                        type: Date,
                        required: true
                    },
                    hardware_id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Hardware'
                    }
                }
            ]
        }
    ]
}
        */
        const { id } = req.params;
        const { hardware_array } = req.body;

        // Find the shift
        const shift = await Shift.findOne({ _id: id });

        if (!shift) {
            const err = new Error('Shift not found');
            err.status = 404;
            throw err;
        }

        const to_remove_hardwares = shift.hardwares_attached.filter(p => hardware_array.includes(p + ""));
        shift.hardwares_attached = shift.hardwares_attached.filter(p => !hardware_array.includes(p + ""));

        const removed_hardwares_ids = to_remove_hardwares.map(p => p + "");
        const not_removed_hardwares_ids = hardware_array.filter(p => !removed_hardwares_ids.includes(p));

        // Save the shift
        await shift.save();

        // reset status of all removed hardwares to idle
        await Hardware.updateMany({ _id: { $in: removed_hardwares_ids } }, { status: 'idle' });

        // reset attached_to_duty of all removed hardwares to null
        await Hardware.updateMany({ _id: { $in: removed_hardwares_ids } }, { attached_to_shift: null });

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Hardwares removed from shift successfully',
            data: {
                hardwares_removed: removed_hardwares_ids,
                hardwares_not_removed: not_removed_hardwares_ids
            }
        });

    } catch (error) {
        next(error);
    }
}

const personnelScoreCalculator = (personnel) => {
    /* helper function for generate report */

}

const generateReport = async (req, res, next) => {
    try {
        const { id, appUpdateTime } = req.params;

        const appUpdateTimeFinal = appUpdateTime || 5;

        // Find the shift
        const shift = await Shift.findOne({ _id: id })
            .populate({
                path: 'personnel_assigned.personnel',
                ref: 'Personnel'
            })
            .populate({
                path: 'hardwares_attached',
                ref: 'Hardware'
            })
            .populate({ // populate duty
                path: 'duty',
                ref: 'Duty'
            })
            .exec();

        const range = Number(shift.distance_radius) || 250;
        const duty_location_lat = Number(shift.duty.location.split(',')[0]);
        const duty_location_long = Number(shift.duty.location.split(',')[1]);


        // const shift_old = JSON.parse({
        //     "_id": "64c91ce556698aa048844324",
        //     "shift_name": "Year Long Duty : Shift 1",
        //     "duty": {
        //         "_id": "64c90e5753ab1fddbaf7f7e7",
        //         "title": "Year Long Duty",
        //         "description": "Duty ends in 2025",
        //         "venue": "India Gate",
        //         "location": "28.6129166,77.2246388",
        //         "start_time": "2023-08-01T03:30:00.000Z",
        //         "end_time": "2025-08-01T03:30:00.000Z",
        //         "note": "For testing",
        //         "shifts": [
        //             "64c91ce556698aa048844324",
        //             "64cd19835d0ec8e9cdb3fbf4",
        //             "64cd289d5d0ec8e9cdb3fe05"
        //         ],
        //         "__v": 3
        //     },
        //     "start_time": "2023-08-01T03:30:00.000Z",
        //     "end_time": "2025-08-01T03:30:00.000Z",
        //     "hardwares_attached": [
        //         {
        //             "_id": "64ce1caf52684a7fdc35a077",
        //             "hardware_id": "123456789",
        //             "secret": "123456789",
        //             "name": "Test hardware",
        //             "description": "Don't Delete;  or De attach",
        //             "type": "sensor",
        //             "status": "occupied",
        //             "__v": 0,
        //             "attached_to_shift": "64c91ce556698aa048844324"
        //         },
        //         {
        //             "_id": "64ceb4a70f3c5d50300c2d61",
        //             "hardware_id": "0522",
        //             "secret": "7335",
        //             "name": "RC522",
        //             "description": "LR RFID 13.56MHz",
        //             "type": "Sensor",
        //             "status": "occupied",
        //             "__v": 0,
        //             "attached_to_shift": "64c91ce556698aa048844324"
        //         },
        //         {
        //             "_id": "64ceb55b0f3c5d50300c2d6a",
        //             "hardware_id": "0200",
        //             "secret": "8726",
        //             "name": "UF200",
        //             "description": "UHF RFID 20KHz",
        //             "type": "Sensor",
        //             "status": "occupied",
        //             "__v": 0,
        //             "attached_to_shift": "64c91ce556698aa048844324"
        //         }
        //     ],
        //     "personnel_assigned": [
        //         {
        //             "personnel": {
        //                 "_id": "64b580ecce6f2178b5a5c963",
        //                 "sid": "42",
        //                 "user": "64b580ecce6f2178b5a5c962",
        //                 "gender": "M",
        //                 "official_name": "Dev Personnel",
        //                 "designation": "officer",
        //                 "photograph": "https://link.png",
        //                 "dob": "2000-07-15T18:30:00.000Z",
        //                 "blood_group": "B-",
        //                 "identification_mark": "None",
        //                 "posted_at": "Delhi",
        //                 "address": "Delhi",
        //                 "__v": 0
        //             },
        //             "status": "completed",
        //             "_id": "64cdfda63765c4cd2536b293",
        //             "gps_data": [
        //                 {
        //                     "timestamp": "2023-07-17T22:48:00.000Z",
        //                     "location": "28.6129166,77.2246388",
        //                     "_id": "64b5c6d60dd2c571201986b8",
        //                     "distance_from_duty_location": 50,
        //                 },
        //             ],
        //             "rfid_data": [
        //                 {
        //                     "timestamp": "2023-08-05T18:16:05.728Z",
        //                     "hardware_id": "64ce1caf52684a7fdc35a077",
        //                     "_id": "64ce91f4398d0918d450e2cb"
        //                 },
        //             ],
        //             "starting_time": "2023-08-07T13:03:39.893Z",
        //             "ending_time": "2023-08-07T13:04:44.846Z"
        //         }
        //     ],
        //     "__v": 259,
        //     "distance_radius": 250,
        //     "issue_reported": [
        //         {
        //             "issue_category": "Electricity",
        //             "description": "No electricity in the area",
        //             "reported_by": "64b580ecce6f2178b5a5c963",
        //             "_id": "64d1287814e31fec707ba631"
        //         }
        //     ]
        // });

        const alloted_personnel_table = []
        // for each loop through all personnel assigned to shift
        shift.personnel_assigned.forEach(personnel => {
            // status of personnel is absent if no gps data and rfid is empty
            let status = "Absent";
            let start_time = "NA";
            let end_time = "NA";
            let score = 0;
            if (personnel.gps_data.length === 0 && personnel.rfid_data.length === 0) {
                status = "Absent"
            } else {
                status = "Present"

                // calculating start_time
                const first_gps_data_timestamp = personnel.gps_data[0].timestamp;
                const first_rfid_data_timestamp = personnel.rfid_data[0].timestamp;
                if (first_gps_data_timestamp < first_rfid_data_timestamp) {
                    start_time = first_gps_data_timestamp;
                } else {
                    start_time = first_rfid_data_timestamp;
                }

                // calculating end_time
                const last_gps_data_timestamp = personnel.gps_data[personnel.gps_data.length - 1].timestamp;
                const last_rfid_data_timestamp = personnel.rfid_data[personnel.rfid_data.length - 1].timestamp;
                if (last_gps_data_timestamp > last_rfid_data_timestamp) {
                    end_time = last_gps_data_timestamp;
                } else {
                    end_time = last_rfid_data_timestamp;
                }

                // calculating score of personnel

                const rfid_score = Math.min(personnel.rfid_data.length, 25); // expecting average 25scans per personnel

                let gps_score_unnormalised = 0; // sum of (1 - distance/max_distance) for all gps data
                // for each loop through gps data of personnel
                personnel.gps_data.forEach(gps_data_record => {
                    const gps_data_record_lat = Number(gps_data_record.location.split(',')[0]);
                    const gps_data_record_long = Number(gps_data_record.location.split(',')[1]);

                    // if gps_data_record.distance_from_duty_location is undefined then use calculateDistance
                    if (gps_data_record.distance_from_duty_location === undefined) {
                        const distance = calculateDistance(duty_location_lat, duty_location_long, gps_data_record_lat, gps_data_record_long);
                        
                        gps_score_unnormalised += (1 -  (distance/range));
                    } else {
                        gps_score_unnormalised += (1-(gps_data_record.distance_from_duty_location / range));
                    }
                });

                score = Math.min(gps_score_unnormalised/personnel.gps_data.length*100, 100) ; // expecting average 25scans per personnel
                
                score = Math.min(score + rfid_score, 100);
            }
            
            const personnel_data_row = {
                sid: personnel.personnel.sid,
                name: personnel.personnel.official_name,
                designation: personnel.personnel.designation,
                posted_at: personnel.personnel.posted_at,
                status: status,
                gender: personnel.personnel.gender,
                start_time: start_time,
                end_time: end_time,
                score: score,
            }
            alloted_personnel_table.push(personnel_data_row);
        });

        // start time is timestamp of first gps data or rfid data whichever is first

        // duty score is average of all personnel score
        let duty_score = 0;
        alloted_personnel_table.forEach(personnel => {
            duty_score += personnel.score;
        });
        duty_score = duty_score / alloted_personnel_table.length;
            
        const data = {
            duty_name: shift.duty.title,
            shift_name: shift.shift_name,
            venue: shift.duty.venue,
            location: shift.duty.location,
            start_time: shift.start_time,
            end_time: shift.end_time,
            no_of_personnel_assigned: shift.personnel_assigned.length,
            no_of_hardwares_attached: shift.hardwares_attached.length,
            range: range,
            no_of_issues_reported: shift.issue_reported.length,
            alloted_personnel_table: alloted_personnel_table,
            duty_score: duty_score,
        }

        res.send(data)

    } catch (err) {
        next(err);
    }
}

const findAvailablePersonnels = async (req, res, next) => {
    const { id } = req.params; // shift_id

    // Find the shift 
    const referenceShift = await Shift.findOne({ _id: id });
    const referenceShiftStartTime = referenceShift.start_time;
    const referenceShiftEndTime = referenceShift.end_time;

    // Find all shifts that clash with referenceShift
    const clashingShifts = await Shift.find({
        $or: [
            { start_time: { $lt: referenceShiftEndTime }, end_time: { $gt: referenceShiftStartTime } },
            { start_time: { $gte: referenceShiftStartTime, $lt: referenceShiftEndTime } },
            { end_time: { $gt: referenceShiftStartTime, $lte: referenceShiftEndTime } }
        ]
    });

    // Find all personnel assigned to clashing shifts using set
    const clashingPersonnel = new Set(); // using set to avoid duplicates
    clashingShifts.forEach(shift => {
        shift.personnel_assigned.forEach(personnel => {
            clashingPersonnel.add(personnel.personnel + "");
        })
    });

    const availablePersonnel = await Personnel.find({ _id: { $nin: Array.from(clashingPersonnel) } });
    res.send(availablePersonnel);
}


export {
    createShift,
    getOngoingShifts,
    deleteShift,
    addPersonnelToShift,
    removePersonnelFromShift,
    addHardwareToShift,
    removeHardwareFromShift,
    getOneShift,
    generateReport,
    findAvailablePersonnels
}