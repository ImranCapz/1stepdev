import Provider from "../models/provider.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "server is working",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
      _id: { $ne: req.params.id },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          ...(req.body.password && { password: bcryptjs.hashSync(req.body.password, 10) }),
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateParent = async (req, res, next)=> {
  if(req.user.id !== req.params.id){
    return next(errorHandler(401, 'You can only update your own account'));
  }
  try {
    const existingUser = await User.findOne({
      $or:[{ username: req.body.username}, {email: req.body.email}],
      _id: {$ne: req.params.id},
    })
    if(existingUser) {
      return res.status(400).json({error: 'Username or email already exists'});
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          ...(req.body.password && { password: bcryptjs.hashSync(req.body.password, 10) }),
          profilePicture: req.body.profilePicture,
          // Add the parent details fields here
          isParent: req.body.isParent,
          dob: req.body.dob,
          gender: req.body.gender,
          address: req.body.address,
          allergies: req.body.allergies,
          bloodGroup: req.body.bloodGroup,
          emergencyContact: req.body.emergencyContact,
          fullName: req.body.fullName,
          height: req.body.height,
          insurance: req.body.insurance,
          medicalHistory: req.body.medicalHistory,
          phoneNumber: req.body.phoneNumber,
          weight: req.body.weight,
        },
      },
      {new: true}
    );

    if (!updateUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const getUserProvider = async (req, res, next) => {
  if(req.user.id === req.params.id) {
    try {
      const providers = await Provider.find({ userRef: req.params.id });
      res.status(200).json(providers);
    } catch (error) {
      next(error);
      
    }

  }else{
    return next(errorHandler(401, 'You can only view your own provider'));
  }
}


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
  if (!user) {
    return next(errorHandler(404, "User not found"));
  }
  const { password, ...rest } = user._doc;
  res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
  
}


export const getUsers = async (req, res, next) => {

  if(!req.user.isAdmin) {
    return next(errorHandler(401, 'You are not authorized to view all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const  limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection})
      .skip(startIndex)
      .limit(limit);

      const userWithoutPassword = users.map((user)=>{
        const {password, ...rest} = user._doc;
        return rest;
      });

      const totalUsers = await User.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() -1,
        now.getDate()
      );
      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo}
      });
      res.status(200).json({users: userWithoutPassword , totalUsers, lastMonthUsers })
    
  } catch (error) { 
    next(error);
  }
}


export const deleteUser = async (req, res, next) => {
  if(!req.user.isAdmin || req.user.id === req.params.userId) {
    return next(errorHandler(401, 'You are not authorized to delete this user'));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({message: 'User has been deleted'});
    
  } catch (error) {
    next(error);
  }
}
