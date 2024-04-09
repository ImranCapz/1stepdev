import Provider from "../models/provider.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

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
};

export const getProviders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;

    if (offer === "undefined" || offer === "false") {
      offer = { $in: [false, true] };
    }

    const searchTerm = req.query.searchTerm || "";
    const address = req.query.address || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const providers = await Provider.find({
      name: { $regex: searchTerm, $options: "i" },
      address: { $regex: address, $options: "i" },
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(providers);
  } catch (error) {
    next(error);
  }
};

export const getAdminProviders = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const providers = await Provider.find(
      ...(req.query.userId && { userRef: req.query.userId })
    );
  } catch (error) {
    next(error);
  }
};

export const favoriteProvider = async (req, res, next) => {
  const { providerId } = req.body;
  const { id: userId } = req.params;
  if (!req.user) {
    return next(errorHandler(401, "You are not authenticated"));
  }
  try {
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return next(errorHandler(404, "Provider not found"));
    }
    const user = await User.findById(userId);
    const index = user.favorites.indexOf(providerId);
    if (index === -1) {
      user.favorites.push(providerId);
      await user.save();
      res.json({ message: "Provider added to favorites", isFavorite: true });
    } else {
      user.favorites.splice(index, 1);
      await user.save();
      res.json({
        message: "Provider removed from favorites",
        isFavorite: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const favoriteStatusProvider = async (req, res, next) => {
  const { providerId } = req.query;
  const { id: userId } = req.params;
  if (!req.user) {
    return next(errorHandler(401, "You are not authenticated"));
  }
  try {
    const user = await User.findById(userId);
    const isFavorite = user.favorites.includes(providerId);
    res.json({ isFavorite });
  } catch (error) {
    next(error);
  }
};

export const favoriteList = async (req, res, next) => {
  const { id: userId } = req.params;
  if (!req.user) {
    return next(errorHandler(401, "You are not authenticated"));
  }
  try {
    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

export const ratingProvider = async (req, res, next) => {
  const { _id } = req.body;
  const { star, providerId } = req.body;
  try {
    const provider = await Provider.findById(providerId);
    let alreadyRated = provider.ratings.find(
      (rating) =>
        rating.postedby && rating.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Provider.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProvider = await Provider.findByIdAndUpdate(
        providerId,
        {
          $push: {
            ratings: {
              star: star,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
    }
    const getallratings = await Provider.findById(providerId);
    let totalratings = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((pre, curr) => pre + curr, 0);
    let actualrating = ratingsum / totalratings;
    let finalrating = await Provider.findByIdAndUpdate(
      providerId,
      {
        totalrating: actualrating,
      },
      { new: true }
    );
    res.status(200).json({ 
      totalrating: finalrating.totalrating.toFixed(2),
     });

  } catch (error) {
    next(error);
  }
};
