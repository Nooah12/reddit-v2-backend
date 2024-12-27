import { Schema, Types, Document, model } from "mongoose";

type TComment = Document & {
    content: string;
    author: Types.ObjectId
    createdAt: Date,
    updatedAt: Date,
    post: Types.ObjectId
}

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User', 
            required: true
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
    },
    {
        timestamps: true, // createad at , updated at
    }
)

export const Comment = model<TComment>('Comment', commentSchema)