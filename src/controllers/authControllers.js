const User = require('../models/User')
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
dotenv.config();


const authControllers = {
    register: async (req, res) => {
        console.log(req.body);
        const UserRegister = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.SECREC_KEY).toString(),
        });
        try {
            const savedUser = await UserRegister.save();
            res.status(200).json(savedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(404).json("User not found!");
            }
            var bytes = CryptoJS.AES.decrypt(user.password, process.env.SECREC_KEY);
            var passwordDBhash = bytes.toString(CryptoJS.enc.Utf8);

            if (passwordDBhash !== req.body.password) {
                return res.status(401).json("Wrong email or password!");
            }
            //accessToken
            const accessToken = jwt.sign({ id: user._id, admin: user.admin },
                process.env.SECREC_KEY,
                { expiresIn: "24h" });

            const { password, ...info } = user._doc;
            return res.status(200).json({ ...info, accessToken });

        } catch (error) {
            res.status(500).json(error);
        }
    }

}

module.exports = authControllers;
