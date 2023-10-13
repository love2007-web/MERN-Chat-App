const { verifyToken } = require("../config/sessions");
const { User } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/sessions").generateToken;


const register = async (req, res) => {
    try {
        const { name, email, password, pic } = req.body;
        const newUser = new User({
            name,
            email,
            password,
            pic,
        });
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const result = await newUser.save();
        console.log(result);
        res.status(200).json({
          success: true,
          message: "User registered successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Registration Failed" }); 
    }

};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          return res
            .status(404)
            .send({ message: "User not Found", status: false });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        const token = generateToken(email)
        if (isMatch) {
          return res
            .status(200)
            .send({ message: `Login Successful`, status: true, token });
        }
        verifyToken
        return res
          .status(401)
          .send({ message: "Invalid Password", status: false });
    } catch (error) {
        console.log(error);
    }
}

const allUsers = async (req, res) => {
    const keyword = req.query.search
    ? {
        $or: [
            {
                name: {
                    $regex: req.query.search,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: req.query.search,
                    $options: "i",
                },
            },
        ],
      } : {};

    const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
    res.send(users);
};

module.exports = { register, login, allUsers };