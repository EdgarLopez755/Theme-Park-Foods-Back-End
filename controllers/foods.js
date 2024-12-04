const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Food = require('../models/food.js');
const router = express.Router();

// ========== Public Routes ===========

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
        req.body.author = req.user._id
        const food = await Food.create(req.body)
        food._doc.author = req.user
        console.log(food._doc)
        res.status(201).json(food)
    }catch(error){
        res.status(500).json(error)
    }
})

router.get('/', async (req, res) => {
    try {
        const foods = await Food.find({})
        .populate('author')
        .sort({ createdAt: 'desc' })
        res.status(200).json(foods)

    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:foodId', async (req, res) => {
    try {
        const food = await Food.findById(req.params.foodId).populate('author') // comments.author ???
        res.status(200).json(food)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/:foodId', async (req, res) => {
    try {
        const food = await Food.findById(req.params.foodId)
        if (!food.author.equals(req.user._id)) {
            return res.status(403).send('You are not allowed to do that!')
        }
        const updatedFood = await Food.findByIdAndUpdate(
            req.params.foodId,
            req.body,
            { new: true }
        )
        updatedFood._doc.author = req.user
        res.status(200).json(updatedFood)
    } catch (error) {
        res.status(500).json(error)
    }
})




// ========= Protected Routes =========


module.exports = router;
