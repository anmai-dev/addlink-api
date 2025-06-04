const User = require("../models/User");
const CryptoJS = require("crypto-js");


const userControllers = {
    updateUser: async (req, res) => {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECREC_KEY).toString();
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted...");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllUser: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    getAllUserPengding: async (req, res) => {
        try {
            const usersPengding = await PendingUser.find();
            if (!usersPengding) {
                console.log('no user')
            }
            return res.status(200).json(usersPengding);
        } catch (error) {
            return res.status(500).json(error);

        }
    }

}
module.exports = userControllers;