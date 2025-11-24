const categoryModel = require('../models/categoryModel');
const productModel = require('../models/productModel');

const createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).send({ success: false, message: 'Provide category name' });
    }

    await categoryModel.create({ category });
    return res.status(200).send({
      success: true,
      message: `${category} category created successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error creating category API',
      error,
    });
  }
};

const getAllCategory = async(req,res)=>{
try {
   const categories = await categoryModel.find({});
   
   if (!categories) {
      return res.status(404).send({ success: false, message: 'cannot find category'});
    }
        return res.status(200).send({
      success: true,
      message: 'category fetched successfully',
      categories
    });


  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in getting category API',
      error,
    });
  }
};

const deleteCategoryController =async (req,res)=>{
    try {
        const category = await categoryModel.findById(req.params.id);

        if(!category){
                  return res.status(404).send({ success: false, message: 'cannot find category'});
        }
        const products = await productModel.find({category:category.id});

        for(let i = 0;i<products.length;i++){
             const product = products[i];
             product.category = undefined;
           await  product.save();
        }
        await category.deleteOne();
            res.status(200).send({
      success: true,
      message: 'category deleted successfully',
    });
    } catch (error) { 
         console.error(error);
    //cast error
    if(error.name === 'CastError'){
        return res.status(500).send({
      success: false,
      message: "Error in deletingProductImage API",
    });
    }
    res.status(500).send({
      success: false,
      message: "Error in deleting product image API",
      error: error.message,
    });
  }
    
}
module.exports = { createCategory,getAllCategory,deleteCategoryController};
