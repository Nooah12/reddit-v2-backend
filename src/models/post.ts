// define database structure
import { Schema, Types, Document, model } from "mongoose";

type TPost = Document & {
    title: string,
    content?: string,
    author: Types.ObjectId,

    upvotes: Types.ObjectId[],
    downvotes: Types.ObjectId[],
    score: number,
    createdAt: Date,
    updatedAt: Date
}

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // samma som User i user.ts
        required: true
    },
    upvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    downvotes: [ // arays med referens till en user så man bara kan vota en gång
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    score: { // score updateras av up/downvotes 
        type: Number,
        default: 0
    },
}, 
{
    timestamps: true
})

export const Post = model<TPost>('Post', postSchema)