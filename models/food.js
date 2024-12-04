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
            required: true
        },
        text: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true,
            enum: ['Main Street', 'Tomorrowland', 'Adventureland', 'Fantasyland', 'Fontierland', 'StarWars land', 'New Orleans Square', 'Toon Town']
        },
        author: { type: mongoose.Schema.Types.ObjectsId, ref: 'User' },
        comments: [commentSchema]
    },

    { timeseries: true }
)

const Food = mongoose.model('Food', foodSchema)

module.exports = Food