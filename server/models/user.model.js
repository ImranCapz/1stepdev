import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,   
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        default:'./src/assets/defaultprofile.jpg',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
},{timestamps: true});


const User = mongoose.model("User", userSchema);

export default User;