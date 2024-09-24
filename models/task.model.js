const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending'},
    dueDate: {type: Date},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model("Task", taskSchema);