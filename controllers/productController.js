const productModel = require('../models/productModel');
const cloudinary = require('cloudinary');
const { getDataUri } = require('../utlis/features');
const { randomInt } = require('crypto');
const getAllProductController = async (req, res) => {
  const {keyword,category} = req.query;
  try {
    const products = await productModel.find({
      name:{
        $regex:keyword ? keyword:' ',
        $options:"i",
      },
      category:category? category:undefined,
    })
    .populate(category)
    res.status(200).send({
      success: true,
      message: "All products fetched successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    
    res.status(500).send({
      success: false,
      message: "Error in getAllProduct API",
      error: error.message,
    });
  }
};

 const getTopProductController = async (req,res)=>{
  try{
    const product = await productModel.find({}).sort({rating:-1}).limit(3)
    res.status(200).send({success:true,message:'top three products'},product); 
    
  }catch(error){
     console.error(error);
    
    res.status(500).send({
      success: false,
      message: "Error in getTopProduct API",
      error: error.message,
    });
  }

 }
const getSingleProduct = async(req,res)=>{
    try {
    const product = await productModel.findById(req.params.id);
    if(!product)
    {
        return res.status(404).send({success:false ,message:"cannot find specified product"});
    }
    res.status(200).send({success:true,message:"product found"});
  } catch (error) {
    console.error(error);
    if(error.name === 'CastError'){
        return res.status(500).send({
      success: false,
      message: "Error in getAllProduct API",
    });
    }
    res.status(500).send({
      success: false,
      message: "Error in getAllProduct API",
      error: error.message,
    });
  }
};
const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || price == null || stock == null) {
      return res.status(400).send({
        success: false,
        message: "Provide all fields",
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Please provide a product image",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);

    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    const product = await productModel.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category: category || null,
      images: [image],
    });
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in createProduct API",
      error: error.message,
    });
  }
};
const updateProductController =async (req,res)=>{
   try {
     const product = await productModel.findById(req.params.id);
     if(!product){
      return  res.status(404).send({
      success: false,
      message: "no such product exist",
    });
     }
    const {name,description,price,stock,category} = req.body;
    if(name){
      product.name =name;
    }

     if(description){
      product.description =description;
    }
     if(price){
      product.price =price;
    }
     if(stock){
      product.stock =stock;
    }
     if(category){
      product.category =category;
    }
    product.save();
    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } 
  catch (error) {
    console.error(error);
    if(error.name === 'CastError'){
        return res.status(500).send({
      success: false,
      message: "Error in getAllProduct API",
    });
    }
    res.status(500).send({
      success: false,
      message: "Error in update product API",
      error: error.message,
    });
  }

}

const updateProductImageController = async(req,res)=>{
   try {
    const product = await productModel.findById(req.params.id);
    if(!product){
       res.status(404).send({
      success: false,
      message: "proudct not foundI",
    });
    }
  //check file
    if(!req.file){
       return res.status(404).send({success:false,message:"product image not found"});
    }
    const file = getDataUri(req.file);
    const cdb =await  cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id:cdb.public_id,
      url:cdb.secure_url,
    }

    product.images.push(image);
    await product.save();
         res.status(201).send({
      success: true,
      message: "Product image updated successfully",
      product,
    });
  } 
  catch (error) {
    console.error(error);
    //cast error
    if(error.name === 'CastError'){
        return res.status(500).send({
      success: false,
      message: "Error in updateProductImage API",
    });
    }
    res.status(500).send({
      success: false,
      message: "Error in updating product image API",
      error: error.message,
    });
  }
} 

const deleteProductImageController = async(req,res)=>{
   try {
    const product = await productModel.findById(req.params.id);
    if(!product){
       res.status(404).send({
      success: false,
      message: "cannot find such product",
    });
    }
    // image id
    const id = req.query.id 
    if(!id){
      res.status(404).send({
      success: false,
      message: "product image not found",
    });
    }
    let isExits =-1;
    product.images.forEach((item ,index)=>{
        if(item._id.toString() === id.toString()){
          isExits = index;
        }
    })

    if(isExits<0){
      return res.status(404).send({success:false,message:"Image not found"});
    }

    await cloudinary.v2.uploader.destroy(product.images[isExits].public_id)
    product.images.splice(isExits,1);
    await product.save();
    res.status(200).send({success:true,message:"product found"});
  } catch (error) {
    console.error(error);
   
    res.status(500).send({
      success: false,
      message: "Error in delete Product API",
      error: error.message,
    });
  }

}

const deleteProductController = async (req,res)=>{
  try {

    const product = await productModel.findById(req.params.id);
    if(!product){
       res.status(404).send({
      success: false,
      message: "cannot find such product",
    });
  } 

  //find and delete image
  for(let index = 0;index<product.image.length;index++){
    await cloudinary.v2.uploader.destroy(product.images[index].public_id)
  }
  await product.deleteOne(); 
      res.status(200).send({success:true,message:"product deleted"});

}catch (error) {
    console.error(error);
   
    res.status(500).send({
      success: false,
      message: "Error in delete Product API",
      error: error.message,
    });
  }
};

const productReviewController = async(req,res)=>{
 try {
  const {comment,rating} = req.body;
  const product = await productModel.findById(req.params.id);
  //check previos review
  const alreadyReview = product.reviews.find((r)=>r.user.toString() === req.user._id.toString())
  if(alreadyReview){
    return res.status(400).send({
      success:false,
      message:'product already reviewed'
    });
  }
  //create new review
  const review = {
    name:req.user.name,
    rating:Number(rating),
    comment,
    user:req.user._id
  }
  //passing review object to review array
  product.reviews.push(review);
  //number of reviews
  product.numReviews = product.reviews.length
  product.rating = product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length

  await product.save();
  res.status(200).send({
    success:true,
    message:'review added'
  });
}catch (error) {
    console.error(error);
   
    res.status(500).send({
      success: false,
      message: "Error in review Product API",
      error: error.message,
    });
  }
}
module.exports = { getAllProductController,getSingleProduct,createProductController,updateProductController,updateProductImageController,deleteProductImageController,deleteProductController,productReviewController,getTopProductController };

