// import express
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config(); //Lấy biến môi trường .env

const authRouter = require('./routers/auth');
const postRouter = require('./routers/post');

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@myccluster.ughla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('connect db success...');
        console.log(Date.now());
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }

};
connectDB();
// khởi tạo
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);

// set chạy trên cổng 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

