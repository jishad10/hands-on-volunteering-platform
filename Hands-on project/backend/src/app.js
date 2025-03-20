import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(
  cors({
    origin: ["*", "http://localhost:5173"], 
    credentials: true,
  })
);

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import eventRouter from './routes/event.routes.js'
import teamRouter from './routes/team.routes.js'
import helpRouter from './routes/help.routes.js'
import volunteerRouter from './routes/volunteer.routes.js'

//routes declaration

app.use("/api/v1/users", userRouter)
app.use("/api/v1/events", eventRouter)
app.use("/api/v1/teams", teamRouter)
app.use("/api/v1/helps", helpRouter)
app.use("/api/v1/volunteer", volunteerRouter)


// http://localhost:8000/api/v1/users/register

export { app }