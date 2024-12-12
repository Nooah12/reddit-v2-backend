import express from "express";
import { getPosts } from "./routes/post"
import mongoose from "mongoose";
import 'dotenv/config'

const app = express()

import { postRouter } from "./routes/post";

app.use(postRouter)

mongoose.connect(process.env.DB_URL!).then(() => {
    const port = process.env.PORT || '8081'
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
    })
})

/* app.listen('8080', () => {
    console.log('Server is running on http://localhost:8080')
})
 */
