import { Request, Response, Router, } from 'express'
import { User } from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const signUp = async (req: Request, res: Response) => {
    try{
        const {username, password} = req.body
        if (!username || !password) {
            res.status(400).json( {message: 'Username and password are required'})
            return
        }

        const existingUser = await User.findOne({ username })
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists'})
            return
        }

        const user = new User({ username, password })
        await user.save()

        res.status(201).json({ message: 'Successfully signed up user'})

    } catch (error) {
        console.log(error)
        res.status(500).send(error) // internal server error
    }
}

const logIn = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required'})
            return
        }

        const user = await User.findOne({ username }, '+password') 
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(400).json({ message: 'Username or password is incorrect'}) 
            return
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' }) // skapar token, blir utloggad efter 1h
        

        res.status(200).json({accessToken, userId: user._id }) 
    } catch (error) {
        console.error(error)
        res.status(500).send()
    }
}

export const authRouter = Router()

authRouter.post('/auth/sign-up', signUp)
authRouter.post('/auth/log-in', logIn)