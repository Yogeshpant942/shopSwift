const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
       await mongoose.connect(process.env.MONGO_URL);
       console.log(`MONGODB_CONNECTED ${mongoose.connection.host}`);
    }
    catch(err){
        console.error(err)
    }
}

module.exports = connectDB