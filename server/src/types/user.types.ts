import { Document } from 'mongoose'

export interface Iuser extends Document {
  username: string
  email: string
  password: string
}
