const mongoose = require('mongoose');

const modelFileSchema = new mongoose.Schema({
  model_id: {
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
  model_url: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  refreshToken: {
    type: String,
  }
});

const ModelFile = mongoose.model('ModelFile', modelFileSchema);
module.exports = ModelFile;