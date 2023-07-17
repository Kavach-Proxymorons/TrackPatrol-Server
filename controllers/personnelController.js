import Personnel from "../models/Personnel.js";
import User from "../models/User.js";
import parseCSV from "../utils/csvParser.js";

const addPersonnel = async (req, res, next) => {
    try{

        // create a new User
        const user = new User({
            username: req.body.sid,
            name: req.body.official_name,
            password: req.body.temp_password,
            role: "personnel"
        });

        const personnel = new Personnel({
            ...req.body,
            user : user._id
        });

        await personnel.save();

        // update the user with the personnel id
        user.personnel_id = personnel._id; // Assign the personnel ID to the user record
        await user.save();
        
        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel created successfully',
            data: personnel
        });

    } catch(error){
        next(error);
    }
}

const bulkCreatePersonnel = async (req, res, next) => {
    // Todo : update the code to better handle the cases when the user already exists
    try{
        const parsedCSV = await parseCSV(req.file.path, true);
        
        // Create a new user for each personnel
        const userPersonnelPair = parsedCSV.map(personnel => {
            const newUser = new User({
                username: personnel.sid,
                name: personnel.official_name,
                password: personnel.temp_password,
                role: "personnel"
            });

            const newPersonnel = new Personnel({
                ...personnel,
                user: newUser._id
            });

            newUser.personnel_id = newPersonnel._id;

            return {
                user: newUser,
                personnel: newPersonnel
            }
        });

        // Save all the users using insertMany
        const bulk_user_create_result = await User.insertMany(userPersonnelPair.map(pair => pair.user));

        // Remove the password from the bulk_user_create_result
        bulk_user_create_result.forEach(user => {
            user.password = undefined;
        });

        // Save all the personnels using insertMany
        const bulk_personnel_create_result = await Personnel.insertMany(userPersonnelPair.map(pair => pair.personnel));

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel created successfully',
            data: {
                bulk_user_create_result,
                bulk_personnel_create_result
            }
        });

    } catch(error){
        next(error);
    }

}

const getPersonnelList = async (req, res, next) => {
    try{
        const { page, limit } = req.query;

        if(isNaN(page) || isNaN(limit))
            throw new Error('Invalid query');

        const personnel = await Personnel.find()
            .populate('user', 'username name last_login role')
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .exec();

        const count = await Personnel.countDocuments();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel list fetched successfully',
            data: {
                personnel,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            }
        });
    } catch(error){
        next(error);
    }
}

const getOnePersonnel = async (req, res, next) => {
    try{
        const { sid } = req.params;

        const personnel = await Personnel.findOne({ sid })
            .populate('user', 'username name last_login role')
            .exec();

        if(!personnel){
            const err = new Error('Personnel not found');
            err.status = 404;
            throw err;
        }

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel fetched successfully',
            data: personnel
        });
    } catch(error){
        next(error);
    }
}

const bulkDeletePersonnel = async (req, res, next) => {
    try{
        // sids is an array of sid
        const { sids } = req.body;

        // finding all the personnels and users to delete
        const personnelsToDelete = await Personnel.find({ sid: { $in: sids } });
        console.log(personnelsToDelete);

        const userIdsToDelete = personnelsToDelete.map(personnel => personnel.user._id);
        console.log(userIdsToDelete);

        // deleting all the personnels and users
        const personnelDeleteResult = await Personnel.deleteMany({ sid: { $in: sids } });
        const userDeleteResult = await User.deleteMany({ _id: { $in: userIdsToDelete } });

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel deleted successfully',
            data: {
                personnelDeleteResult,
                userDeleteResult
            }
        });
        
    } catch(error){
        next(error);
    }
}

const deleteOnePersonnel = async (req, res, next) => {
    try{
        const { sid } = req.params;

        const personnel = await Personnel.findOne({ sid })

        if(!personnel){
            const err = new Error('Personnel not found');
            err.status = 404;
            throw err;
        }

        const deletedUser = await User.findByIdAndDelete(personnel.user._id);
        const deletedPersonnel = await Personnel.findByIdAndDelete(personnel._id);

        deletedUser.password = undefined;

        const deletedPersonnelData = {
            personnel: deletedPersonnel,
            user: deletedUser
        }

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel deleted successfully',
            data: deletedPersonnelData
        });
    } catch(error){
        next(error);
    }
}

const searchPersonnel = async (req, res, next) => {
    try{
        console.log("req recieved");
        // search by name, sid
        const { q, page, limit } = req.query;
        console.log(q);

        const personnel = await Personnel.find({
            $or: [
                { official_name: { $regex: q, $options: 'i' } },
                { sid: { $regex: q, $options: 'i' } }
            ]
        })
            .populate('user', 'username name last_login role')
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .exec();

        const count = await Personnel.countDocuments({
            $or: [
                { official_name: { $regex: q, $options: 'i' } },
                { sid: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        });

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel list fetched successfully',
            data: {
                personnel,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            }
        });
    } catch(error){
        next(error);
    }
}

const updateOnePersonnel = async (req, res, next) => {
    try{
        const { sid } = req.params;

        const personnel = await Personnel.findOne({ sid });

        if(!personnel){
            const err = new Error('Personnel not found');
            err.status = 404;
            throw err;
        }

        const updatedPersonnel = await Personnel.findOneAndUpdate({ sid }, {
            ...req.body  // be careful here
        }, { new: true });

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Personnel updated successfully',
            data: updatedPersonnel
        });
    } catch(error){
        next(error);
    }
}

export {
    addPersonnel,
    bulkCreatePersonnel,
    getPersonnelList,
    getOnePersonnel,
    bulkDeletePersonnel,
    deleteOnePersonnel,
    searchPersonnel,
    updateOnePersonnel
}
