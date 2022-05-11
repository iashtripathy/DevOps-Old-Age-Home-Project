const mongoose = require("mongoose");

const labourSchema = new mongoose.Schema({                             
    fullname: {
        type: String,
        required: [true, "No name given!"]
    },
    email: String,
    phone: {
        type: Number,
      //  min: 10,
      //  max: 12,
        required: [true,"No contact number given!"]                     
    },
    state: String,
    district: String,
    landmark: String,
    filename: String,
    description: String
});

module.exports =  Labour = mongoose.model("Labour", labourSchema);                  