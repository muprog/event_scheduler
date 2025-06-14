import { Schema, model } from 'mongoose'
import { Iuser } from '../types/user.types'

const UserSchema = new Schema<Iuser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

export const User = model<Iuser>('User', UserSchema)
