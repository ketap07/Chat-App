const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken")


const createToken = (_id) => {

    const jwtkey = process.env.JWT_SECRET_KEY;

    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" })

};

// create User
const userRegister = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        //user with the Email already exist

        let user = await userModel.findOne({ email }); //

        if (user)
            return res.status(400).json("User with given email already exist ... ");

        //  for empty 
        if (!name || !email || !password)
            return res.status(400).json("All fields are required ... ");

        //  validator for checking email format
        if (!validator.isEmail(email))
            return res.status(400).json("Email must be a valid ... ");

        if (!validator.isStrongPassword(password))
            return res.status(400).json("Please provide strong password ...")

        user = await userModel({ name, email, password })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user._id);
        //for pay load
        res.status(200).json({ _id: user._id, name, email, token });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};


// find if the email and password is present in database for login
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        let user = await userModel.findOne({ email });

        if (!user)
            return res.status(400).json("Invalid email or password ...")

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword)

            return res.status(400).json("Invalid email or password ...")

        const token = createToken(user._id)

        res.status(200).json({ _id: user._id, name: user.name, email, token });

    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);

    }
};

// find for one user
const findUser = async (req, res) => {

    const userId = req.params.userId;
    // console.log("userID",userId)

    try {
        const user = await userModel.findById(userId)
        res.status(200).json(user)

    } catch (error) {
        console.log(error);
        res.status(500).json(error);

    }


};

// get multiple user
const getUsers = async (req, res) => {

    try {
        const users = await userModel.find()
        res.status(200).json(users)


    } catch (error) {
        console.log(error);
        res.status(500).json(error);

    }

}



module.exports = { userRegister, loginUser, findUser, getUsers }