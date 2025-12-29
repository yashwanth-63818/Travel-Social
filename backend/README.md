# TravelSocial Backend API

A Node.js/Express backend API for the TravelSocial application - a social platform for travelers.

## Features

- User authentication (signup/login) with JWT
- Secure password hashing with bcrypt
- MongoDB database integration
- RESTful API endpoints
- CORS enabled for frontend integration
- Environment-based configuration
- Input validation and error handling

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or remote)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/travelsocial
JWT_SECRET=your_super_secure_jwt_secret_key_32_characters_minimum
PORT=5000
NODE_ENV=development
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm run validate-env` - Validate environment variables

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Hidden Places
- `GET /api/places/hidden` - Get user's hidden places (protected)
- `POST /api/places/hidden` - Add new hidden place (protected)
- `DELETE /api/places/hidden/:id` - Remove hidden place (protected)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS protection
- Environment variable validation
- Secure HTTP headers

## Development

1. Start MongoDB service
2. Run `npm run dev` to start the development server
3. The API will be available at `http://localhost:5000`

## Production

Ensure all environment variables are properly set in your production environment, especially:
- Use a strong, unique `JWT_SECRET`
- Set `NODE_ENV=production`
- Use a secure MongoDB connection string
- Configure proper CORS settings

## License

ISC