const mongoose = require('mongoose');

const uploadProgressSchema = new mongoose.Schema({
  progress_id: {
    type: String,
    required: true,
    unique: true,
    primaryKey: true
  },
  task_id: {
    type: String,
    required: true,
    ref: 'Task' // 引用Task模型
  },
  progress: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const UploadProgress = mongoose.model('UploadProgress', uploadProgressSchema);
module.exports = UploadProgress;