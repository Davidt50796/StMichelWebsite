import { type Application } from 'express'
import user_routes from '../routes/userRoutes'


export default function setupRoutes (app: Application): void {
  app.use('/api/v1', user_routes)

  // Catch-all route to handle 404s
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' })
  })
}
