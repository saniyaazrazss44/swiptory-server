const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Likes = require('../models/likes');
const verifyJwt = require('../middleware/authMiddleware')

router.use(bodyParser.json());

router.post("/likeDislikeStory", verifyJwt, async (req, res) => {
    try {
        const { userId, storyId } = req.body;

        if (!userId || !storyId) {
            return res.status(400).json({
                status: 400,
                message: 'User ID and Story ID are required'
            });
        }

        const existingLike = await Likes.findOne({ userId, storyId });

        if (existingLike) {
            await Likes.deleteOne({ userId, storyId });

            return res.status(200).json({
                status: 200,
                message: 'Story disliked successfully',
                userId: userId
            });
        } else {
            await Likes.create({ userId, storyId });

            return res.status(201).json({
                status: 201,
                message: 'Story liked successfully',
                userId: userId
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
});

router.post("/viewLikeCount", async (req, res) => {
    try {
        const { storyId } = req.body;

        if (!storyId) {
            return res.status(400).json({
                status: 400,
                message: 'Story ID is required'
            });
        }

        const likeCount = await Likes.countDocuments({ storyId });

        res.status(200).json({
            status: 200,
            message: 'Likes fetched successfully',
            likeCount: likeCount
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
});

module.exports = router;