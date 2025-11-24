import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

//USER AUTH
export const isAuth = async (req, res, next) => {
  const { token } = req.cookies; 

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized user",
    });
  }

  try {
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decodeData._id);
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

//ADMIN AUTH
export const isAdmin = async(req,res)=>{
  if(req.user.role != 'admin'){
     return res.status(401).send({
      success:false,
      message:"Admin Only",
     });
  }
  next();
};
