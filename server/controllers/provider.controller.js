import Provider from "../models/provider.model.js";
import { errorHandler } from "../utils/error.js";

export const createProvider = async (req, res, next) => {
  try {
    const provider = await Provider.create(req.body);
    return res.status(201).json(provider);
  } catch (error) {
    next(error);
  }
};

export const deleteProvider = async (req, res, next) => {
  const provider = await Provider.findById(req.params.id);
  if (!provider) {
    return next(errorHandler(404, "Provider not found"));
  }
  if (req.user.id !== provider.userRef) {
    return next(errorHandler(401, "You can delete only your provider"));
  }

  try {
    await Provider.findByIdAndDelete(req.params.id);
    res.status(200).json("Provider deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updateProvider = async (req, res, next) => {
  const provider = await Provider.findById(req.params.id);
  if (!provider) {
    return next(errorHandler(404, "Provider not found"));
  }
  if (req.user.id !== provider.userRef) {
    return next(errorHandler(401, "You can update only your provider"));
  }
  try {
    const updatedProvider = await Provider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProvider);
  } catch (error) {
    next(error);
  }
};

export const getProvider = async (req, res, next) => {
  try {
    const listing = await Provider.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Provider not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
}