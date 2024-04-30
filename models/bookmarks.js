const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const bookmarksSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Bookmarks", bookmarksSchema)