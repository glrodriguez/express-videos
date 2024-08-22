import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: false
  }
});

const Message = new mongoose.model("Message", messageSchema);

export default Message;
