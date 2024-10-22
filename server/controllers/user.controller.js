import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'; 

const register = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    // Validate all fields are provided
    if (!name || !email || !password || !confirmPassword) {
        return next(new AppError("All fields are required!", 400));
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return next(new AppError("Passwords do not match", 400));
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new AppError("Email already exists", 400));
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Send success response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user // Sending the user object or parts of it
        });
    } catch (error) {
        // Log error for debugging
        console.error('Error during user registration:', error);

        // Send generic error message
        return next(new AppError("User registration failed, please try again", 400));
    }
};

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // set to true in production
    maxAge: 24 * 60 * 60 * 1000 // 1 day
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("All fields are required", 400));
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new AppError("Invalid email or password", 401));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError("Invalid email or password", 401));
        }

        const token = await user.generateJWTToken();
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            success: true,
            message: "User Logged in successfully",
            user,
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

const googleSignIn = async (req, res, next) => {
    const { uid, email, name } = req.body;

    // Validate the incoming data
    if (!uid || !email || !name) {
        return next(new AppError("Missing required fields", 400));
    }

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });

        // If user does not exist, create a new user
        if (!user) {
            user = await User.create({
                name,
                email,
                password: 'google-sign-in', // Placeholder, password isn't required for Google users
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Send the token as a cookie
        res.cookie("token", token, cookieOptions);

        // Respond with user data and token
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            user,
        });
    } catch (error) {
        console.error('Google Sign-In error:', error);
        return next(new AppError("Google Sign-In failed, please try again", 500));
    }
};

export {
    register,
    login,
    googleSignIn
};





// import AppError from "../utils/error.util.js";
// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from 'jsonwebtoken'; 

// const register = async (req, res, next) => {
//     const { name, email, password, confirmPassword } = req.body;

//     // Validate all fields are provided
//     if (!name || !email || !password || !confirmPassword) {
//         return next(new AppError("All fields are required!", 400));
//     }

//     // Check if passwords match
//     if (password !== confirmPassword) {
//         return next(new AppError("Passwords do not match", 400));
//     }

//     try {
//         // Check if user already exists
//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return next(new AppError("Email already exists", 400));
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create the user
//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//         });

//         // Send success response
//         res.status(201).json({
//             success: true,
//             message: "User registered successfully",
//             user // Sending the user object or parts of it
//         });
//     } catch (error) {
//         // Log error for debugging
//         console.error('Error during user registration:', error);

//         // Send generic error message
//         return next(new AppError("User registration failed, please try again", 400));
//     }
// };

// const cookieOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // set to true in production
//     maxAge: 24 * 60 * 60 * 1000 // 1 day
//   };
  


// const login = async(req,res,next) =>{
//     const{email,password}=req.body;


//     if(!email || !password){
//         return next(new AppError("All fields are required",400))
//     }

//     try{
//         const user= await User.findOne({email});
//         if(!user){
//             return next(new AppError("Invalid email or password",401));
//         }

//         const token=await user.generateJWTToken();
        
//         res.cookie("token", token, cookieOptions);
//         res.status(200).json({
//             success:true,
//             message:"User Loggedin successfully",
//             user,
//         })
        
//     }catch(e){
//         return next(new AppError(e.message, 500));


//     }

// }

// export {
//     register,
//     login
// };
