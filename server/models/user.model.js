// import mongoose, { model, Schema } from "mongoose";
// import jwt from 'jsonwebtoken';

// const userSchema = new Schema({
//     name: {
//         type: String,
//         required: [true, "Name is Required"],
//         minLength: [3, "Name must be at least 3 characters"],
//         maxLength: [50, "Name should be less than 50 characters"],
//         lowercase: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: [true, "Email is Required"],
//         lowercase: true,
//         trim: true,
//         unique: true,
//         match: [
//             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//             "Please fill in a valid email address",
//         ],
//     },
//     password: {
//         type: String,
//         required: [true, "Password is required"],
//         minlength: [8, "Password must be at least 8 characters"],
//         select: false, // Do not return password in queries
//     }
// }, {
//     timestamps: true,
// });

// userSchema.methods = {
//     generateJWTToken: function () {
//       return jwt.sign(
//         { id: this._id, email: this.email, role: this.role },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: process.env.JWT_EXPIRY,
//         }
//       );
//     },
// }  

// const User = model("User", userSchema);
// export default User;

import mongoose, { model, Schema } from "mongoose";
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
        minLength: [3, "Name must be at least 3 characters"],
        maxLength: [50, "Name should be less than 50 characters"],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        lowercase: true,
        trim: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please fill in a valid email address",
        ],
    },
    password: {
        type: String,
        required: false // Password is not required for Google sign-in users
    }
}, {
    timestamps: true,
});

userSchema.methods = {
    generateJWTToken: function () {
        return jwt.sign(
            { id: this._id, email: this.email },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d',
            }
        );
    },
};

const User = model("User", userSchema);
export default User;
