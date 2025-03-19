const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{type:String,default:""},
    },
    {timestamps:true}
);


module.exports = mongoose.model("User", UserSchema);