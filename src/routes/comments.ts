import { Router, Request, Response } from "express";
import { Comment } from "../models/comment";
import { Post } from "../models/post";
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
      
      console.log('API Response:', formattedComments);
      res.status(200).json(formattedComments);
    } catch (error) {
      console.error(error);
      res.status(500).send()
    }
  };

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
        const { commentId, postId } = req.params;
        const userId = req.userId; 

        try {
            const comment = await Comment.findById(commentId);
            if (!comment) {
                res.status(404).json({ error: 'Comment not found' });
                return
            }
    
            const post = await Post.findById(postId);
            if (!post) {
                res.status(404).json({ error: 'Post not found' });
                return
            }
    
            const isCommentAuthor = comment.author.toString() === userId;
            const isPostAuthor = post.author.toString() === userId;
    
            if (!isCommentAuthor && !isPostAuthor) {
                res.status(403).json({ error: 'You are not authorized to delete this comment' });
                return
            }
    
            await Comment.findByIdAndDelete(commentId);
    
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ error: 'Failed to delete comment' });
        }
};

export const commentRouter = Router()

commentRouter.get("/posts/:postId/comments", getComments);
commentRouter.post("/posts/:id/comments", authenticate, createComment);
commentRouter.delete("/comments/:postId/:commentId", authenticate, deleteComment);