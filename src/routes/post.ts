import { Request, Response, Router } from "express";

export const getPosts = async (req: Request, res: Response) => {
    // get posts from database

    res.status(200).json([{title: 'hello world'}])
}

const getPost = async (req: Request, res: Response) => {
    const { id } = req.params

    // get post from database by id

    res.status(200).json({title: 'hello world', id})
}

export const postRouter = Router()

// skapar en specifik router för posts?
postRouter.get('/posts', getPosts)
postRouter.get('/posts/:id', getPost)