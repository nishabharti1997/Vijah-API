const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "fullname is not Provide"],
        },
        email: {
            type: String,
            unique: [true, "email already exists in database "],
            lowercase: true,
            trim: true,
            required: [true, 'email not provided'],
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: '{VALUE} is not a valid email!'
            }
        },
        email_verified: {
          type: Date,
          default: Date.now,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
          type: Number,
        },
        birthday: {
          type: String,
        },
        gender: {
          type: String,
        },
        address: {
          type: String,
        },
        isAdmin: {      
            type: Boolean,  // true for admin false for user
            default: false,
          },
          otp: {
            type: Number,
          },
          status : {
            type: String,
          },
          image :{
            type: String,
          },
          token : {
            type: String,
          },
    },
    {timestamps:true}
);

const user = mongoose.model("USER", UserSchema);
module.exports = user;