import { Router, Request, Response } from "express";
import { Comment } from "../models/comment";
import { authenticate } from "../middleware/authenticate";
import { isValidObjectId, ObjectId } from "mongoose";

type AuthorWithUsername = {
    _id: ObjectId
    username: string
  }

const getComments = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const comments = await Comment.find({ postId }).populate('author', 'username');
  
      const formattedComments = comments.map(comment => {
        const author = comment.author as unknown as AuthorWithUsername;
        return {
            id: comment._id,
            content: comment.content,
            author: {
                id: author._id,
                username: author.username,
            },
        }
      });
      
      console.log('API Response:', formattedComments); // Add this line
      res.status(200).json(formattedComments);
    } catch (error) {
      console.error(error);
      res.status(500).send()
    }
  };
  

/* const getComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId).populate('author', 'username');

        if (!comment) {
            res.status(404).json({ message: "No comment found" });
            return
        }
        
        res.status(200).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching the comment" });
    }
}; */

const createComment = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const { id } = req.params; // post ID

        if (!content || typeof content !== 'string') {
            res.status(400).json({ message: "Invalid comment content" });
            return
        }

        const comment = await Comment.create({
            content,
            postId: id,
            author: req.userId,
        });

        res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;

        if (!isValidObjectId(commentId)) {
            res.status(400).json({ message: 'Invalid comment id' })
            return
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return
        }

        if (comment.author.toString() !== req.userId) {
            res.status(403).json({ message: "You are not the author of this comment" });
            return
        }

        await comment.deleteOne();
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};

export const commentRouter = Router()

//commentRouter.get("/comments/:commentId", getComment);
commentRouter.get("/posts/:postId/comments", getComments);
commentRouter.post("/posts/:id/comments", authenticate, createComment);
commentRouter.delete("/comments/:commentId", authenticate, deleteComment);