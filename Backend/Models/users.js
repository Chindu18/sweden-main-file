import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  collectorType: { type: String, enum: ["video speed", "others"], default: "video speed" },
  access:{type:String,required:true,default:"denied"},
  collectedAmount:{type:String,default:""}
});

export default mongoose.model("auth", authSchema);
