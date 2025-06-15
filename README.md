# Event Scheduler

A modern event scheduling application built with Next.js and Node.js, featuring a full-stack architecture with TypeScript support.

## Project Structure

The project is organized into two main directories:

- `client/`: Next.js frontend application
- `server/`: Node.js backend application

## Tech Stack

### Frontend (Client)

- Next.js
- TypeScript
- Tailwind CSS
- ESLint
- PostCSS

### Backend (Server)

- Node.js
- TypeScript
- Express.js

## Features

### Event Management

- Create, edit, and delete events
- Set event title, description, date, and time
- Add event location and participants
- Set event reminders and notifications
- Categorize events with custom tags

### User Features

- User registration and authentication
- Personal event dashboard
- Calendar view of all events
- Search and filter events
- Export events to calendar applications

### Collaboration

- Share events with other users
- Invite participants via email
- Set event visibility (public/private)
- Comment on events
- RSVP to events

### Notifications

- Email notifications for upcoming events
- Reminder settings
- Updates on event changes
- Participant responses notifications

### Calendar Integration

- View events in different calendar formats
- Sync with external calendar applications
- Recurring event support
- Time zone support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd event_scheduler
```

2. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Running the Application

1. Start the backend server:

```bash
cd server
npm run dev
```

2. Start the frontend development server:

```bash
cd client
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000 (default)

## Deployment

### Deploying Frontend to Vercel

1. **Prepare Your Project**

   - Make sure your project is pushed to a GitHub repository
   - Ensure your `next.config.ts` is properly configured
   - Verify all environment variables are properly set up

2. **Deploy to Vercel**

   - Go to [Vercel's website](https://vercel.com) and sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your Next.js application
   - Configure your project:
     - Framework Preset: Next.js
     - Root Directory: `client` (since your frontend is in the client directory)
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Add your environment variables if needed
   - Click "Deploy"

3. **Post-Deployment**

   - Vercel will automatically deploy your application
   - You'll receive a unique URL for your deployed application
   - You can set up a custom domain in the Vercel dashboard
   - Enable automatic deployments for future updates

4. **Continuous Deployment**
   - Vercel automatically creates preview deployments for pull requests
   - Production deployments are triggered when you push to your main branch
   - You can configure deployment settings in the Vercel dashboard

Note: Make sure your backend API URL is properly configured in your frontend environment variables to point to your production backend server.

## Development

### Client-side Development

The client application is built with Next.js and includes:

- Modern React features
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality

### Server-side Development

The server application includes:

- RESTful API endpoints
- TypeScript support
- Express.js framework

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/event_scheduler](https://github.com/yourusername/event_scheduler)
