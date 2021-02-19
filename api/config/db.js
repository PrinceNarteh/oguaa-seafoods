const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log('Database connected successfully!');
}

module.exports = connectDB;