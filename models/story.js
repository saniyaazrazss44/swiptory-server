const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const storySchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    slides: [{
        heading: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: [
                'food', 'health and fitness', 'travel', 'movies', 'education'
            ],
            required: true
        }
    }]

});

module.exports = mongoose.model("Story", storySchema)