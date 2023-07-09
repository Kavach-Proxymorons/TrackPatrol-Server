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
            .populate('user', 'username name')
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

export {
    addPersonnel,
    getPersonnelList
}
