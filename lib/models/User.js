import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "roman-urdu",
  },
  weakTopics: {
    type: [String],
    default: [],
  },
  studiedTopics: {
    type: [String],
    default: [],
  },
  sessionRecaps: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  university: {
    type: String,
    default: "IoBM",
  },
  program: {
    type: String,
    default: "",
  },
  semester: {
    type: Number,
    default: 1,
  },
  subjects: {
    type: [String],
    default: [],
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
