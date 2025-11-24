import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

export const createOrderCategory = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItem,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount
    } = req.body;
    if (!shippingInfo || !shippingInfo.address || !shippingInfo.city || !shippingInfo.country) {
      return res.status(400).json({ success: false, message: "Complete shippingInfo is required" });
    }
    const order = await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItem,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount
    });
    for (let i = 0; i < orderItem.length; i++) {
      const product = await productModel.findById(orderItem[i].product);
      if (!product) continue; 
      product.stock -= orderItem[i].quantity;
      await product.save(); }
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in create order API",
      error: error.message,
    });
  }
};

export const getMyOrdersControllers =async (req,res)=>{
    try {
        const orders = await orderModel.find({user:req.user._id});
        if(!orders){
           return res.status(400).json({ success: false, message: "no order found" });
        }
        return res.status(200).send({success:true,message:"your order is placed",totalOrder:orders.length,orders});
    } catch (error) {
        console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in my orders order API",
      error: error.message,
    });
    }
};
export const getMySingleOrder =async (req,res)=>{
    try {
        const orders = await orderModel.findById(req.params.id);
         if(!orders){
           return res.status(400).json({ success: false, message: "no order found" });
        }
       return res.status(200).send({success:true,message:"your order is placed",orders});
    } catch (error) {
        console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in my orders order API",
      error: error.message,
    });
    }
};
export const paymentController = async (req,res)=>{
    try {
        const {totalAmount} = req.body;
        if(!totalAmount)
        {
      return res.status(400).json({ success: false, message: "total amount is required"});

        }
      const {client_secret} =   await stripe.paymentIntents.create({
            amount:Number(totalAmount),
            currency:'usd'
        })
        res.status(200).send({ 
            success:true,
        })
    }
     catch (error) {
   console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in my orders order API",
      error: error.message,
    });
    }
};

//===========
//ADMIN SECTION
export const getAllOrdersControllers = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      totalOrders: orders.length,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in getAllOrders API",
      error: error.message,
    });
  }
};


export const changeOrderStatusController = async (req,res)=>{

  try{
   //find error
    const order = await orderModel.findById(req.params.id);
    if(!order){
            return res.status(400).json({ success: false, message: "order not found"});}

      if(order.orderStatus === "proccessing"){
        order.orderStatus =  "shipped"
      }
      else if(order.orderStatus === "shipped"){
        order.orderStatus= "deliverd";
        order.deliveryAt =  Date.now();
      }
      else{
        return res.status(500).json({ success: false, message: "order already delivered"});}

        await order.save();

         res.status(200).send({
      success: true,
      message: "Orders status updated successfully",
      
    });
      }

      catch(error){
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Error in getAllOrders API",
          error: error.message,
        });
      }
    }

