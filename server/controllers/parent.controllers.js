import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const fetchParent = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can fetch only your parent"));
  }
  try {
    const parent = await User.findById(req.params.id);
    if (!parent) {
      return next(errorHandler(404, "Parent not found"));
    }
    res.status(200).json(parent);
  } catch (error) {
    next(error);
  }
};

export const updateParent = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }
  try {
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
      _id: { $ne: req.params.id },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isParent: req.body.isParent,
          parentDetails: {
            lookingFor: req.body.parentDetails.lookingFor,
            dob: req.body.parentDetails.dob,
            gender: req.body.parentDetails.gender,
            address: req.body.parentDetails.address,
            allergies: req.body.parentDetails.allergies,
            bloodGroup: req.body.parentDetails.bloodGroup,
            emergencyContact: req.body.parentDetails.emergencyContact,
            fullName: req.body.parentDetails.fullName,
            height: req.body.parentDetails.height,
            insurance: req.body.parentDetails.insurance,
            medicalHistory: req.body.parentDetails.medicalHistory,
            phoneNumber: req.body.parentDetails.phoneNumber,
            weight: req.body.parentDetails.weight,
          },
        },
      },
      { new: true }
    );
    if (!updateUser) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};