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
        
        res.status(201).json(food)
    }catch(error){
        res.status(500).json(error)
    }
})

router.get('/', async (req, res) => {
    try {
        const foods = await Food.find({})
        .populate('author')
        .sort({ createdAt: 'desc'})
        res.status(200).json(foods)

    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:foodId', async (req, res) => {
    try {
        const food = await Food.findById(req.params.foodId).populate([ 'author', 'comments.author'])
        res.status(200).json(food) 
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/:foodId', async (req, res) => {
    try {
        const food = await Food.findById(req.params.foodId)
        if (!food.author.equals(req.user._id)) {   // check for ._id
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


router.delete('/:foodId', async (req, res) => {
    try {
        const food = await Food.findById(req.params.foodId)
        if (!food.author.equals(req.user._id)) {     // check for ._id
            return res.status(403).send('You are not allowed to do that.')
        }
        const deletedFood = await Food.findByIdAndDelete(req.params.foodId)
        res.status(200).json(deletedFood)
    } catch (error) {
        res.status(500).json(error)
    }
})


router.post('/:foodId/comments', async (req, res) => {
    try {
        req.body.auhtor = req.user._id
        const food = await Food.findById(req.params.foodId)
        food.comments.push(req.body)
        await food.save()
        const newComment = food.comments[food.comments.length - 1]
        newComment._doc.author = req.user
        res.status(201).json(newComment)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/:foodId/comments/:commentId', async (req, res) => {
    try {
        const food = await Food.findById(req.params.foodId)
        const comment = food.comments.id(req.params.commentId)
        comment.text = req.body.text
        await food.save()
        res.status(200).json({ message: 'Ok' })
    } catch (error) {
        res.status(500).json(error)
    }
})


router.delete('/:foodId/comments/:commentId', async (req, res) => {
    try {
        const food = await Food.findById(req.params.foodId)
        food.comments.remove({ _id: req.params.commentId })
        await food.save()
        res.status(200).json({ message: 'Ok' })
    } catch (error) {
        res.status(500).json(error)
    }
})





module.exports = router;
