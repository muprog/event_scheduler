import { User } from '../models/user'
import { Event } from '../models/event'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'
const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser })
  } catch (error) {
    console.error('Registration error:', error)
    // res.status(500).json({ message: 'Server error' })
  }
}

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    })

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    // res.status(500).json({ message: 'Server error' })
  }
}

const getProfile = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ user })
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

const getUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ user })
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    res.status(500).json({ message: 'Server error' })
  }
}

const logoutUser = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout successful' })
}

const postEvents = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      startDateTime,
      endDateTime,
      recurrence,
      createdBy,
    } = req.body

    if (!name || !startDateTime || !createdBy) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Validate and structure recurrence if present
    let recurrenceRule = null

    if (recurrence) {
      const {
        frequency,
        interval,
        intervalUnit,
        daysOfWeek,
        nthWeekdayOfMonth,
      } = recurrence

      if (
        !['none', 'daily', 'weekly', 'monthly', 'yearly', 'custom'].includes(
          frequency
        )
      ) {
        return res.status(400).json({ message: 'Invalid recurrence frequency' })
      }

      recurrenceRule = {
        frequency,
        interval: interval ?? 1,
        intervalUnit,
        daysOfWeek,
        nthWeekdayOfMonth,
      }
    }

    const event = new Event({
      title: name,
      description,
      startDate: new Date(startDateTime),
      endDateTime,
      recurrenceRule,
      createdBy,
    })

    await event.save()

    res.status(201).json({ message: 'Event created successfully', event })
  } catch (error) {
    console.error('Error creating event:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

const getEvents = async (req: Request, res: Response) => {
  const { createdBy } = req.query

  if (!createdBy) {
    return res.status(400).json({ message: 'createdBy is required' })
  }

  try {
    const events = await Event.find({ createdBy })
    res.json({ events })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

interface AuthRequest extends Request {
  user?: { id: string }
}

const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ createdBy: req.user!.id }).lean()
    res.status(200).json({ events })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getMyEvents = async (req: Request, res: Response) => {
  const email = (req as any).user?.email // get email from authenticated user
  if (!email) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  try {
    const events = await Event.find({ createdBy: email }).lean()
    res.status(200).json({ events })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
}
const deleteEvent = async (req: Request<{ id: string }>, res: Response) => {
  const userEmail = (req as any).user.email
  const eventId = req.params.id

  try {
    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    if (event.createdBy !== userEmail)
      return res.status(403).json({ message: 'Unauthorized' })

    await Event.findByIdAndDelete(eventId)
    res.status(200).json({ message: 'Event deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}
const getEdit = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const event = await Event.findById(id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json({ event })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const putEdit = async (req: Request, res: Response) => {
  try {
    const updateData = req.body
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    // Update fields (use the fixed names per your schema)
    event.title = updateData.title ?? event.title
    event.description = updateData.description ?? event.description
    event.startDate = updateData.startDate
      ? new Date(updateData.startDate)
      : event.startDate
    event.endDateTime = updateData.endDateTime
      ? new Date(updateData.endDateTime)
      : event.endDateTime
    event.recurrenceRule = updateData.recurrenceRule ?? event.recurrenceRule
    event.createdBy = updateData.createdBy ?? event.createdBy

    await event.save()
    res.json({ message: 'Event updated successfully', event })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event' })
  }
}
const test = (req: Request, res: Response) => {
  res.send('hello')
}

module.exports = {
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
  test,
}
