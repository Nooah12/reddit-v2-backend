/* import { Router, Request, Response } from "express";
import { Comment } from "../models/comment";
import { authenticate } from "../middleware/authenticate";
import { ObjectId } from "mongoose";

type AuthorWithUsername = {
    _id: ObjectId
    username: string
  }

const getComments = async (req: Request, res: Response) => {
    try {
        const { post } = req.params; // extract "post" from the route params
        const comments = await Comment.find({ post }).populate('author', 'username');


        if (!comments.length) {
            return res.status(404).json({ message: "No comments found for this post" });
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching comments" });
    }
};

const getComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId).populate('author', 'username');

        if (!comment) {
            return res.status(404).json({ message: "No comment found" });
        }
        
        res.status(200).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching the comment" });
    }
};

const createComment = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const { id } = req.params; // post ID

        if (!content || typeof content !== 'string') {
            return res.status(400).json({ message: "Invalid comment content" });
        }

        const comment = await Comment.create({
            content,
            post: id,
            author: req.user._id,
        });

        res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const commentRouter = Router()

commentRouter.get("/posts/:post/comments", getComments);
commentRouter.get("/comments/:commentId", getComment);
commentRouter.post("/posts/:post/comments", authenticate, createComment); */


/* 
GET /posts/:postId/comments → Fetch all comments for a post (parent comments only).
POST /posts/:postId/comments → Create a new comment on a post.
POST /comments/:commentId/replies → Add a reply to a specific comment.
PATCH /comments/:commentId/vote → Add/remove a vote to a comment or reply. */