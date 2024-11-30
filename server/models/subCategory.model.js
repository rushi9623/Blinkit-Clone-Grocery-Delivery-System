const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
        required: true  // Optional: add required if 'name' is necessary
    },
    image: {
        type: String,
        default: "",
    },
    category: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "category"
        }
    ]
}, {
    timestamps: true,
});

const SubCategoryModel = mongoose.model('subcategory', subCategorySchema);

module.exports = SubCategoryModel;  // Changed to 'SubCategoryModel' for consistency
