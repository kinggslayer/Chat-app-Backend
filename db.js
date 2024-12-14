const mongoose= require("mongoose");
const mongoURI="mongodb://localhost:27017/";

const connectToMongo= async ()=>{
   await mongoose.connect(mongoURI).then(()=>console.log("Connected to mongo")).catch((e)=>console.log(e.message))

}
module.exports = connectToMongo;