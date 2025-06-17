import authenticate from '../middleware/auth'
import { CorsOptions } from 'cors'
const express = require('express')
const router = express.Router()
const cors = require('cors')

const {
  registerUser,
  loginUser,
  getProfile,
  getUser,
  logoutUser,
  postEvents,
  getEvents,
  getMe,
  getMyEvents,
  deleteEvent,
  getEdit,
  putEdit,
} = require('../controllers/controller')

const allowedOrigins: string[] = [
  process.env.FRONTEND_URL!,
  process.env.FRONTEND_URLL!,
  'https://www.google.com',
  'https://www.google.com/',
  'http://localhost:3000/',
  'http://localhost:3000',
].filter(Boolean)

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error(`Not allowed by CORS: ${origin}`))
    }
  },
  credentials: true,
}

router.use(
  // cors({
  //   origin: process.env.FRONTEND_URL,
  //   credentials: true,
  // })
  cors(corsOptions)
)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)
router.get('/user', getUser)
router.post('/logout', logoutUser)

router.post('/events', postEvents)

router.get('/events', getEvents)
router.get('/me', authenticate, getMe)
router.get('/me/events', authenticate, getMyEvents)

router.delete('/events/:id', authenticate, deleteEvent)
router.get('/events/:id', getEdit)
router.put('/events/:id', putEdit)

module.exports = router
