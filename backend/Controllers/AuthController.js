const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const UserModel = require("../Models/User");

const signup = async (req, res) => {
    try {
        const { name, email, password, gender, yearOfStudy } = req.body;

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: 'User already exists, you can login',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userModel = new UserModel({
            name,
            email,
            password: hashedPassword,
            gender,
            yearOfStudy
        });

        await userModel.save();
        res.status(201).json({
            message: "Signup Successful",
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


const login= async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if(!user){
            return res.status(403)
                .json({message: errorMsg, success: false});

        }
        const isPassEqual= await bcrypt.compare(password, user.password)
        if(!isPassEqual){
            return res.status(403)
                .json({message: errorMsg, success: false}); 
        }
         // ✅ Include role in the token
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200)
            .json(
                {
                    message: "Login Success", 
                    success: true,
                    jwtToken,
                    email,
                    name: user.name,
                    role: user.role  
                }
            )
        
    }catch(err){
        res.status(500)
            .json(
                {
                    message: "internal server error", 
                    success: false
                }
            )
        
    }
}
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Ensure passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false
            });
        }

        const existingAdmin = await UserModel.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({
                message: 'Admin already exists, try logging in',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role: 'admin'  // 👈 Important: distinguish admin from student
        });

        await adminUser.save();

        res.status(201).json({
            message: "Admin registered successfully",
            success: true
        });

    } catch (err) {
        console.error("Admin signup error:", err.message);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};



module.exports= {
    signup,
    login,
    registerAdmin
}