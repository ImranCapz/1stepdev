import Rating from "../models/rating.model.js";
import Provider from "../models/provider.model.js";

export const reviewProvider = async (req, res, next) => {
  const { _id } = req.body;
  const { star } = req.body;
  const { providerId } = req.body;
  try {
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    let rating = await Rating.findOne({ postedby: _id, provider: providerId });
    if (rating) {
      rating.star = star;
      await rating.save();
    } else {
      rating = new Rating({ star: star, provider: providerId, postedby: _id });
      await rating.save();
    }
    const ratings = await Rating.find({ provider: providerId });
    console.log('Ratings:',ratings);
    let totalratings = ratings.length;
    console.log('Total ratings before calculation:', totalratings);
    let ratingsum = ratings
      .map((item) => item.star)
      .reduce((pre, curr) => pre + curr, 0);
    let actualrating = ratingsum / totalratings;
    provider.totalrating = actualrating;
    await provider.save();
    res.status(200).json({
        totalrating:provider.totalrating.toFixed(2),
        totalratings:totalratings
    })
  } catch (error) {
    next(error);
  }
};

export const getRatings = async (req, res, next) => {
  const { providerId } = req.params;
  try {
    const ratings = await Rating.find({ provider: providerId });
    let totalratings = ratings.length;
    let ratingsum = ratings.map((item)=>item.star).reduce((pre,curr)=>pre+curr,0);
    let actualrating = totalratings > 0 ? ratingsum / totalratings : 0;
    res.status(200).json({
      totalrating: actualrating.toFixed(2),
      totalratings: totalratings
    });
  } catch (error) {
    next(error);
  }
}