import Provider from "../models/provider.model.js";
import Favorite from "../models/favorite.model.js";
import { errorHandler } from "../utils/error.js";

export const favoriteProvider = async (req, res, next) => {
    const {providerId} = req.body;
    const {id: userId} =req.params;
    if(!req.user){
        return next(errorHandler(401,"You are not authenticated"));
    }
    try {
        const provider = await Provider.findById(providerId);
        if(!provider){
            return next(errorHandler(404,"Provider not found"));
        }
        const existingFavorite = await Favorite.findOne({user:userId,provider:providerId});
        if(!existingFavorite){
            const favorite = new Favorite({user:userId,provider:providerId});
            await favorite.save(
                res.json({message:"Provider added to favorites",isFavorite:true})
            )
        } else{
            await Favorite.deleteOne({_id:existingFavorite._id});
            res.json({message:"Provider removed from favorites",isFavorite:false})
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
      const favorite = await Favorite.findOne({user:userId,provider:providerId});
      const isFavorite = !!favorite;
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
      const favorite = await Favorite.find({user: userId}).populate("provider");
      if (!favorite) {
        return next(errorHandler(404, "Favorite  not found"));
      }
      res.json({ success: true, favorites: favorite.map(favorite=> favorite.provider) });
    } catch (error) {
      next(error);
    }
  };
  
  