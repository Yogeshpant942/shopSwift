const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true,'email already taken'], 
    },
    password:{
        type:String,
        required:[true,'password is required'],
        minLength:[6,'password lenght must be atleast 6'],
    },
    address:{
        type:String,
        required:[true,'address is required'],
    },
    city:{
        type:String,
        required:[true,'city name is required'],
    },
    country:{
        type:String,
        required:[true,'country name is required'],
    },
    phoneNo:{
        type:String,
        required:[true,'PhoneNo is required'],
    },
    profilePic:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        },
    },
    answer:{
        type:String,
        required:[true,'answer is required'],
    },
    role:{
        type:String,
        default:'user',
    }
},{timestamps:true});

//hash function
userSchema.pre('save',async function(){
    if(!this.isModified('password'))return next();
    this.password = await bcrypt.hash(this.password,10);
});

//compare function
userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword,this.password);
};

userSchema.methods.generateToken = function() { 
    return JWT.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"7d"});
};

const User = mongoose.model('userModel', userSchema);
module.exports = User;


