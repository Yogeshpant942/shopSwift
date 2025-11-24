const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');
const path = require('path');

const ownerRouter = require('./routes/ownerRouter');
const userRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productRouter');

const db = require('./config/mongoose-connection');
app.use(express.json);
app.use(express.urlencoded({extended:true}));
app.use(cookieparser);
app.use(express.static(path.join(__dirname,"public")));
app.set("view-engine","ejs");

app.use("/owners",ownerRouter);
app.use("/users",userRouter);
app.use("/product",productsRouter);
app.listen(3000);