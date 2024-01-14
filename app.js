import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


//Import routes
import userRoutes from './routes/user.routes.js'
import healthCheck from './routes/healthcheck.routes.js'
import tweetRoutes from './routes/tweet.routes.js'
import playlistRoutes from './routes/playlist.routes.js'
//routes declaration
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/healthcheck", healthCheck)
app.use("/api/v1/tweet", tweetRoutes)
app.use("/api/v1/playlist", playlistRoutes)




export { app }