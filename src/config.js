import { config } from 'dotenv'
config()
export default {
 mongodbURL: process.env.MONGODB_URI || 'mongodb://localhost/book-fair',
 port: process.env.PORT || 8000,
 corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}