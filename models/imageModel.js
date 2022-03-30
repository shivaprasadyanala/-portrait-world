const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    title: String,
    content: String,
    heading: String,
    imageUrl: String
})

module.exports = mongoose.model('image', imageSchema)