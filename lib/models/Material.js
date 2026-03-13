import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
  },
  s3Key: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    default: 'General',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Material || mongoose.model('Material', MaterialSchema);
