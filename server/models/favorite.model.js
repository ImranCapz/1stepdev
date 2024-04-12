import  mongoose  from "mongoose";



const favoriteSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    provider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'provider',
        required:true
    }
})


const Favorite = mongoose.model('Favorite',favoriteSchema)


export default Favorite;