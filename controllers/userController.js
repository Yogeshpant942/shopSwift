import User from "../models/userModel.js";
import { getDataUri } from "../utlis/features.js";
import cloudinary from 'cloudinary';
 export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phoneNo ,answer} = req.body;

    if (!name || !email || !password || !address || !city || !country || !phoneNo ||!answer) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists, try logging in",
      });
    }

    const user = await User.create({ name, email, password, address, city, country, phoneNo,answer });

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
// LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

        //token 
    const token = user.generateToken();
    res.status(200).cookie("token",token,{
      expires:new Date(Date.now()+15*24*60*60*1000),
      secure:process.env.NODE_ENV === "development"?true:false,
      httpOnly:process.env.NODE_ENV === "development"?true:false
    }).send({
      success: true,
      message: "Login successful",
      token, 
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getUserProfileController = async (req,res) =>{
  try{
    const user = await User.findById(req.user._id);
     user.password = undefined;
    res.status(200).send({
      success:true,
      message:"user profile fetched successfully",
      user,
    });

  }catch(err){
    console.log(err);
    res.status(500).send({success:false ,message:"error in profile api"},err);
  }
};

export const logOutUserProfile = async(req,res)=>{
     try{
          res.status(200).cookie("token","",{
             expires:new Date(Date.now()+15*24*60*60*1000),
      secure:process.env.NODE_ENV === "development"?true:false,
      httpOnly:process.env.NODE_ENV === "development"?true:false
          }).send({
            success:true,
            message:"logout successfully",
          });
     }catch(err){
      console.log(err);
      res.status(500).send({success:false ,message:"error in  logout "},err);
     }
}
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).send({
        success: false,
        message: "Cannot find the user",
      });

    const { name, email, address, city, country, phoneNo } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phoneNo) user.phoneNo = phoneNo;

    // ✅ Save the updated user document
    await user.save();
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error in profile update",
      error: err.message,
    });
  }
};
//update user password
export const updateUserPassword = async (req,res)=>{
  try {
    
    const user =await  User.findById(req.user._id);
    const {oldPassword,newPassword} = req.body;
    
    if(!oldPassword || !newPassword){
      return res.status(500).send({success:false,message:"All fields are required"});
    }
    const isMatch =await user.comparePassword(oldPassword);
    if(!isMatch){
  return res.status(500).send({
      success: false,
      message: "enter the correct password",
    });
    }
    user.password = newPassword;
   await user.save();

 res.status(200).send({
      success: true,
      message: "Password updated successfully",
      user,
    });
  } catch (err) {
     console.error(err);
    res.status(500).send({
      success: false,
      message: "Error in changing password",
    });
  }
};
export const uploadProfilePicture = async (req,res)=>{
      try {
        const user = await User.findById(req.user._id);
        //get file from user
        const file  = getDataUri(req.file);
        //delete prev image 
        // await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
        //update
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        user.profilePic = {
          public_id:cdb.public_id,
          url:cdb.secure_url
        }
        await user.save();
        res.status(200).send({success:true,message:"profile picture updated"});
      } catch (err) {
        console.error(err);
    res.status(500).send({
      success: false,
      message: "Error in uploading picture",
    });
      }
};

export const passwordResetController = async(req,res)=>{
  try {
     const {email,newPassword,answer} = req.body;
     const user = await User.findOne({email,answer});
     if(!email|| !newPassword || !answer){
            return res.status(500).send({success:false,message:"invalid user and answer"});
     }
      user.password = newPassword;
  await  user.save();

  res.status(200).send({
    success:false,
    message:"password change successfully",
  });
  } catch (error) {
     console.error(err);
    res.status(500).send({
      success: false,
      message: "Error in password reset",
  })
}
}
