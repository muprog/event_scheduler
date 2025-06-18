import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT, () => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })
  })
  .catch((err) => console.error(err))
app.use('/', require('./routes/auth'))
