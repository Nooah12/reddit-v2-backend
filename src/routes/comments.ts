import { Router, Request, Response } from "express";
import { Comment } from "../models/comment";
import { authenticate } from "../middleware/authenticate";
import { isValidObjectId, ObjectId } from "mongoose";
import { Post } from "../models/post";

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
    /* try {
        const { commentId } = req.params;
        console.log('Attempting to delete comment:', commentId);
        console.log('User attempting deletion:', req.userId);

        if (!isValidObjectId(commentId)) {
            res.status(400).json({ message: 'Invalid comment id' })
            return
        }

        const comment = await Comment.findById(commentId);
        console.log('Found comment:', comment);
        console.log('Comment post ID:', comment?.post); // Let's see what this value actually is


        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return
        }

        const post = await Post.findById(comment.post);
        console.log('Found post:', post);
        console.log('Post author ID:', post?.author);

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return
        }

        const isCommentAuthor = comment.author.toString() === req.userId;
        const isPostAuthor = post.author.toString() === req.userId;
        console.log('Is comment author:', isCommentAuthor);
        console.log('Is post author:', isPostAuthor);

        if (!isCommentAuthor && !isPostAuthor) {
            console.log('User not authorized');
            res.status(403).json({ message: "You are not authorized to delete this comment" });
            return
        }

/*         if (comment.author.toString() !== req.userId) {
            res.status(403).json({ message: "You are not the author of this comment" });
            return
        } 

        await comment.deleteOne();
        console.log('Comment successfully deleted');
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error('Error in deleteComment:', error);
        res.status(500).send();
    } */


        const { commentId, postId } = req.params;
        const userId = req.userId; // Assuming user ID is available in the request via authentication middleware

        try {
            // Fetch the comment
            const comment = await Comment.findById(commentId);
            if (!comment) {
                res.status(404).json({ error: 'Comment not found' });
                return
            }
    
            // Fetch the post to which the comment belongs
            const post = await Post.findById(postId);
            if (!post) {
                res.status(404).json({ error: 'Post not found' });
                return
            }
    
            // Check if the user is the comment author or the post author
            const isCommentAuthor = comment.author.toString() === userId;
            const isPostAuthor = post.author.toString() === userId;
    
            if (!isCommentAuthor && !isPostAuthor) {
                res.status(403).json({ error: 'You are not authorized to delete this comment' });
                return
            }
    
            // Delete the comment
            await Comment.findByIdAndDelete(commentId);
    
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ error: 'Failed to delete comment' });
        }
};

export const commentRouter = Router()

//commentRouter.get("/comments/:commentId", getComment);
commentRouter.get("/posts/:postId/comments", getComments);
commentRouter.post("/posts/:id/comments", authenticate, createComment);
commentRouter.delete("/comments/:postId/:commentId", authenticate, deleteComment);