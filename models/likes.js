const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const likesSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    storyId: {
        type: ObjectId,
        ref: "Story",
        required: true
    }
});

module.exports = mongoose.model("Likes", likesSchema)