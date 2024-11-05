const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task_id: {
    type: String,
    required: true,
    unique: true,
    primaryKey: true
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User' // 引用User模型
  },
  file_name: {
    type: String,
    required: true
  },
  oss_url: {
    type: String,
    required: true
  },
  task_status: {
    type: Number,
    required: true
  },
  start_timecode: {
    type: Date
  },
  finish_timecode: {
    type: Date
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

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;