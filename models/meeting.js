const mongoose = require("mongoose");

const adoptSchema = new mongoose.Schema({                              // layout of book-a-meeting form schema
    fullname: {
        type: String,
        required: [true,"No name specified!"]
    },
    gender: {
        type: String,
        required: [true,"No gender specified!"]
    },
    marriage: {
        type: String,
        required: [true,"Martial status not specified!"]
    },
    age: {
        type: Number,
        min: 25,
        max: 50,
        required: [true,"No age specified"]
    },
    email: String,
    address: String,
    job: String,
    income: Number,
    phonenumber: {
        type: Number,
      //  min: 10,
      //  max: 12,
        required: [true,"No contact number given!"]
    },
    date: Date,
    time: String,
    reason: String
});

module.exports =  Meeting = mongoose.model("Meeting", adoptSchema);                // creating a model for meeting schema