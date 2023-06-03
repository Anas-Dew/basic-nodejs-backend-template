const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Article = require('../models/Article')
const { body, validationResult } = require('express-validator');

router.get('/articles', fetchuser, async (req, res) => {
    try {
        const articles = await Article.find({ user: req.user.id });
        res.status(200).json({
            statusCode: 200,
            data: {
                articles: articles
            },
            error: {//if any exists
                message: "null"
            }
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            data: {},
            error: {//if any exists
                message: "Internal Server Error."
            }
        })
    }
})

router.post('/users/:userId/articles', fetchuser, [
    body('title', 'Title must be added').isLength({ min: 1 }),
    body('description', 'Description must be added').isLength({ min: 1 }),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            statusCode: 400,
            data: {},
            error: {//if any exists
                message: errors.array()
            }
        });
    }
    try {
        const { title, description } = req.body
        const article = new Article({
            user: req.user.id, title, description
        })
        const savedArticle = await article.save()
        res.status(200).json({
            statusCode: 200,
            data: {
                savedArticle: savedArticle
            },
            error: {//if any exists
                message: "null"
            }
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            data: {
                message: "Internal server error."
            },
            error: {//if any exists
                message: error
            }
        })
    }
})



module.exports = router