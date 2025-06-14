import mongoose, { Schema, Document } from 'mongoose'

export interface IRecurrenceRule {
  frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  interval?: number // every 'n-th' day/week/month/year, default 1
  intervalUnit?: 'days' | 'weeks' | 'months' | 'years' // ← NEW
  daysOfWeek?: number[] // 0 = Sunday, 1 = Monday, ... for weekly recurrence
  nthWeekdayOfMonth?: { week: number; weekday: number } // e.g. second Friday {week: 2, weekday: 5}
}

export interface IEvent extends Document {
  title: string
  description?: string
  startDate: Date
  endDateTime?: Date // for multi-day events or optional
  recurrenceRule?: IRecurrenceRule | null
  createdBy: string // user id or email, etc
  createdAt: Date
}

const RecurrenceRuleSchema = new Schema<IRecurrenceRule>(
  {
    frequency: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly', 'custom'],
      required: true,
    },
    interval: { type: Number, default: 1 },
    intervalUnit: {
      type: String,
      enum: ['days', 'weeks', 'months', 'years'], // ← NEW
    },
    daysOfWeek: [{ type: Number, min: 0, max: 6 }],
    nthWeekdayOfMonth: {
      week: { type: Number, min: 1, max: 5 },
      weekday: { type: Number, min: 0, max: 6 },
    },
  },
  { _id: false }
)

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDateTime: Date,
  recurrenceRule: { type: RecurrenceRuleSchema, default: null },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
})

export const Event = mongoose.model<IEvent>('Event', EventSchema)
