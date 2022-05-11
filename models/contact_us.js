const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({                            // layout of contact-us form schema
    fullname: {
        type: String,
        required: [true,"No name specified!"]
    },
    email: String,
    subject: {
        type: String,
        required: [true,"No subject specified!"]
    },
    description: String
});

module.exports =  Contact = mongoose.model("Contact", contactSchema);             // creating a model for contactSchema and exporting to app.js file


