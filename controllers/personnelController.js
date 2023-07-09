import Personnel from "../models/Personnel.js";
import User from "../models/User.js";

const addPersonnel = async (req, res, next) => {
    try{

        // create a new User
        const user = new User({
            username: req.body.sid,
            name: req.body.official_name,
            password: req.body.temp_password,
            role: "personnel"
        });

        await user.save();

        const personnel = new Personnel({
            ...req.body,
            user : user._id
        });

        await personnel.save();

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

export {
    addPersonnel,
    getPersonnelList,
    getOnePersonnel,
    bulkDeletePersonnel,
    deleteOnePersonnel,
    searchPersonnel
}
