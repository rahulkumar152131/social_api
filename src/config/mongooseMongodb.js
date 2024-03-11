import mongoose from "mongoose";

export const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        // await mongoose.connect(process.env.DB_URL, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // });
        console.log("MongoDB connected using mongoose");
    } catch (err) {
        console.log("MongoDb Error", err);
    }
}

