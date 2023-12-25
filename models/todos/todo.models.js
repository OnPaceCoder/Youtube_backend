import mongoose from 'mongoose';
const subToDoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const toDoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    subTodos: {
        type: [subToDoSchema],
    }

}, { timestamps: true })

export const Todo = mongoose.model("Todo", toDoSchema)