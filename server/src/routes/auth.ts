import authenticate from '../middleware/auth'

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

router.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
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
