import mongoose, { Schema, mongo } from "mongoose";
import User from './UserModel.js';

const Income = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        default: "Income"
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


export default mongoose.model('Income', Income);

