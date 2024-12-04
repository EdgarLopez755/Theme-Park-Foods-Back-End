const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
) 

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        text: {
            type: String,
            require: true
        },
        location: {
            type: String,
            require: true,
            enum: ['Main Street', 'Tomorrowland', 'Adventureland', 'Fantasyland', 'Fontierland', 'StarWars land', 'New Orleans Square', 'Toon Town']
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comments: [commentSchema]
    },

    { timestamps: true }
)

const Food = mongoose.model('Food', foodSchema)

module.exports = Food