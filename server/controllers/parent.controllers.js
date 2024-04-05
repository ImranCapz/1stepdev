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
