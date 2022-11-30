import mongoose from "mongoose";
import config from "./config";

(async () => {
 try {
  const db = await mongoose.connect(config.mongodbURL,
   {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   });
  console.log('Connected to MongoDB database: ', db.connection.name)
 } catch (error) {
  console.log(error)
 }
})()