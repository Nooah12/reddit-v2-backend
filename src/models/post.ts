import { Schema, Types, Document, model } from "mongoose";

type TComment = Document & {
    content: string;
    author: Types.ObjectId
    createdAt: Date,
    updatedAt: Date
}

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User', // samma som User i user.ts
            required: true
        },
    },
    {
        timestamps: true, // createad at , updated at
    }
)

type TPost = Document & {
    title: string,
    content?: string,
    author: Types.ObjectId,
    comments: TComment[],
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
    comments: [commentSchema], // en array med comments från commentSchema
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