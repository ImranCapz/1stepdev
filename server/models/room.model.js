import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    roomID: {
        type: String,
        required: true,
        unique: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider'
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Room = mongoose.model('Room', roomSchema);

export default Room