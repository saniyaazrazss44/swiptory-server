const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Story = require('../models/story');

router.use(bodyParser.json());

router.post("/shareStory", async (req, res) => {
    try {
        const { storyId } = req.body;

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({
                status: 404,
                message: "story not found."
            });
        }

        const sharedStoryURL = `${req.protocol}://${req.get('host')}/api/share/viewStory/${storyId}`;

        res.status(200).json({
            status: 200,
            message: "Story shared successfully.",
            sharedStoryURL: sharedStoryURL
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
});

router.get("/viewStory/:storyId", async (req, res) => {
    try {
        const { storyId } = req.params;

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({
                status: 404,
                message: "Story not found."
            });
        }

        res.status(200).json({
            status: 200,
            message: "Story retrieved successfully.",
            story: story
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