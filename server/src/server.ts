import express from 'express'
import cors from 'cors'
import authRouter from "./routes/auth";
import projectsRouter from './routes/projects'
import eventsRouter from './routes/events'
import { config } from './config'

const app = express()

app.use(cors())
app.use(express.json())
// app.use(cors({
//   origin: `http://localhost:${config.localPort}`
// }));

// Routes
app.use("/auth", authRouter);
app.use('/projects', projectsRouter)
app.use('/events', eventsRouter)

// Start server
const PORT = config.localPort || 4000
app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`)
})
