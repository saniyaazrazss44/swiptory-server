const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Bookmarks = require('../models/bookmarks');
const verifyJwt = require('../middleware/authMiddleware')

router.use(bodyParser.json());

router.post("/addRemoveBookmarks", verifyJwt, async (req, res) => {
    try {
        const { userId, storyId } = req.body;

        if (!userId || !storyId) {
            return res.status(400).json({
                status: 400,
                message: 'User ID and Story ID are required'
            });
        }

        const existingBookmark = await Bookmarks.findOne({ userId, storyId });

        if (existingBookmark) {
            await Bookmarks.deleteOne({ userId, storyId });

            return res.status(200).json({
                status: 200,
                userId: userId,
                message: 'Story removed from bookmarks successfully',
            });
        } else {
            await Bookmarks.create({ userId, storyId });

            return res.status(201).json({
                status: 201,
                userId: userId,
                message: 'Story added to bookmarks successfully',
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

router.post("/getBookmarks", verifyJwt, async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: 'User ID is required'
            });
        }

        const bookmarks = await Bookmarks.find({ userId }).populate('storyId');

        res.status(200).json({
            status: 200,
            message: 'Bookmarks fetched successfully',
            userId: userId,
            bookmarks: bookmarks.map(bookmark => bookmark.storyId),
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