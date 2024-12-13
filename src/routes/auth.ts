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

        const existingUser = await User.findOne({ username }) //user kommer va unikt (username: required: true) därav findONE
        if (existingUser) {
            res.status(400).json('Username already exists')
            return
        }

        const user = new User({ username, password }) // skapar user 
        await user.save() // skickar user till databasen?

        res.status(201).json({ message: 'Successfully signed up user'}) //201 created

    } catch (error) {
        console.log(error)
        res.status(500).send(error) // internal server error
    }
}

const logIn = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body
        if (!username || !password) {
            res.status(400).json('Username and password are required')
            return
        }

        const user = await User.findOne({ username }, '+password') // select password för att kunna jämföra med password från req.body
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(400).json('Username or password is incorrect') // fungerar eller måste ha message: ?
            return
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' }) // skapar token, blir utloggad efter 1h
        

        res.status(200).json({accessToken, userId: user._id })  // ser ingen token i postman??
    } catch (error) {
        console.error(error)
        res.status(500).send()
    }
}

export const authRouter = Router()

authRouter.post('/auth/sign-up', signUp)
authRouter.post('/auth/log-in', logIn)