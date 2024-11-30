const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: Array,
        default: []
    },
    category: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'category'
        }
    ],
    subCategory: [
        {
            type: mongoose.Schema.ObjectId,  // Fixed typo from 'momgoose' to 'mongoose'
            ref: 'subCategory'
        }
    ],
    unit: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: 0,  // Default value set to 0
    },
    price: {
        type: Number,
        default: 0,  // Default value set to 0
    },
    discount: {
        type: Number,
        default: null,
    },
    description: {
        type: String,
        default: ""
    },
    more_details: {
        type: Boolean,
        default: false  // Default to false
    },
    publish: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;  // Fixed export statement