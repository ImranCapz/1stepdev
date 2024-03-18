import Provider from "../models/provider.model.js";

export const createProvider = async (req,res,next)=>{

    try {
        const provider = await Provider.create(req.body);
        return res.status(201).json(provider);
    } catch (error) {
        next(error);
    }
}