import express from "express";
import mongoose from "mongoose";
import 'dotenv/config'
import { postRouter } from "./routes/posts";
import { profileRouter } from "./routes/profile";
import { authRouter } from "./routes/auth";
import { commentRouter } from "./routes/comments";
import cors from "cors";

const app = express()
app.use(express.json())
app.use(cors())

app.use(postRouter)
app.use(authRouter)
app.use(profileRouter)
app.use(commentRouter)

mongoose.connect(process.env.DB_URL!).then(() => {
    const port = process.env.PORT || '8081'
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
    })
})