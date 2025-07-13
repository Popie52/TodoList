import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: Boolean,
    createdAt: Date,
    updatedAt: Date,
    dueDate: Date,
    priority: String,
    category: {
        type: String,
        default: ''
    },
    tags: {
        type: [String],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

todoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Todo = mongoose.model('Todo', todoSchema);
export default Todo;