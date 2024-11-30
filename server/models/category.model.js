const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
        required: true  // Optional: add required if name is necessary
    },
    image: {  // Changed 'Image' to lowercase 'image'
        type: String,
        default: "",
    }
}, {
    timestamps: true,
});

const CategoryModel = mongoose.model('category', categorySchema);

module.exports = CategoryModel;  // Changed to 'CategoryModel' for consistency
