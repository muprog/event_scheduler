import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  user?: { id: string; email: string }
}

// const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided' })
//   }

//   const token = authHeader.split(' ')[1]

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
//     req.user = { id: decoded.id }
//     next()
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid or expired token' })
//   }
// }

// export default authenticate

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      email: string
    }
    req.user = { id: decoded.id, email: decoded.email } // 🔧 include email here
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default authenticate
