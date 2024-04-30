const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Story = require('../models/story');
const verifyJwt = require('../middleware/authMiddleware')

router.use(bodyParser.json());

router.post("/addStory", verifyJwt, async (req, res) => {
    try {
        const { userId, slides } = req.body;

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: 'User ID is required'
            });
        }

        if (!slides || slides.length < 3 || slides.length > 6) {
            return res.status(400).json({
                status: 400,
                message: 'Slides should be between 3 and 6'
            });
        }

        for (const slide of slides) {
            if (!slide.heading || !slide.description || !slide.image || !slide.category) {
                return res.status(400).json({
                    status: 400,
                    message: 'All fields (heading, description, image, category) are required for each slide'
                });
            }
        }

        const newStory = new Story({
            userId: userId,
            slides: slides
        });
        const savedStory = await newStory.save();

        res.status(201).json({
            status: 201,
            message: 'Story created successfully',
            story: savedStory
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
})

router.post("/editStory", verifyJwt, async (req, res) => {
    try {
        const { userId, storyId, slides } = req.body;

        if (!userId || !storyId) {
            return res.status(400).json({
                status: 400,
                message: 'User ID and Story ID are required'
            });
        }

        const existingStory = await Story.findOne({ _id: storyId, userId: userId });

        if (!existingStory) {
            return res.status(404).json({
                status: 404,
                message: 'Story not found'
            });
        }

        if (!slides || slides.length < 3 || slides.length > 6) {
            return res.status(400).json({
                status: 400,
                message: 'Slides should be between 3 and 6'
            });
        }

        for (const slide of slides) {
            if (!slide.heading || !slide.description || !slide.image || !slide.category) {
                return res.status(400).json({
                    status: 400,
                    message: 'All fields (heading, description, image, category) are required for each slide'
                });
            }
        }

        existingStory.slides = slides;
        const updatedStory = await existingStory.save();

        res.status(200).json({
            status: 200,
            message: 'Story updated successfully',
            story: updatedStory
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
})

router.post("/fetchStoryDetails", async (req, res) => {
    try {
        const { storyId } = req.body;

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({
                status: 404,
                message: 'Story not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Story details fetched successfully',
            data: story
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
});

router.post("/getStoriesByCategory", async (req, res) => {
    try {
        const { category } = req.body;

        if (category === 'all') {
            const categories = {
                'food': 'Top Stories About food',
                'health and fitness': 'Top Stories About health and fitness',
                'travel': 'Top Stories About travel',
                'movies': 'Top Stories About movies',
                'education': 'Top Stories About education'
            };

            let allStories = [];
            for (const [cat, catTitle] of Object.entries(categories)) {
                const categoryStories = await Story.find({ 'slides.category': cat });
                allStories.push({ category: catTitle, stories: categoryStories });
            }

            res.status(200).json({
                status: 200,
                stories: allStories
            });
        } else if (category) {
            const categories = {
                'food': 'Top Stories About food',
                'health and fitness': 'Top Stories About health and fitness',
                'travel': 'Top Stories About travel',
                'movies': 'Top Stories About movies',
                'education': 'Top Stories About education'
            };

            if (!categories.hasOwnProperty(category)) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid category'
                });
            }

            const categoryTitle = categories[category];
            const categoryStories = await Story.find({ 'slides.category': category });
            res.status(200).json({
                status: 200,
                stories: [{ category: categoryTitle, stories: categoryStories }]
            });
        } else {
            res.status(200).json({
                status: 200,
                stories: []
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

router.post("/getYourStories", verifyJwt, async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: 'userId is required'
            });
        }

        const yourStories = await Story.find({ userId });

        res.status(200).json({
            status: 200,
            message: 'Success',
            stories: yourStories
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