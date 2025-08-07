# StockWatch - Stock Market Monitoring System

Professional full-stack application for real-time stock market monitoring with alert system and notifications.

**Author:** steedware

## Application Features

### Core Features
- **User Authentication** - Registration and login with JWT tokens
- **Dashboard** - Portfolio management of watched stocks
- **Trending Stocks** - Browse most popular stocks on the market
- **Alert System** - Notifications when price thresholds are exceeded
- **REST API** - Complete API with Swagger documentation
- **Responsive Design** - Mobile-friendly application

### Technical Features
- JWT Authentication
- PostgreSQL Database
- Flyway Migrations
- OpenAPI/Swagger Documentation
- Docker Containerization
- Real-time Monitoring

## API Endpoints

### Authentication (http://localhost:8080/api/auth)
- `POST /register` - Register new user
- `POST /login` - User login

### Watchlist (http://localhost:8080/api/watchlist)
- `GET /` - Get list of watched stocks
- `POST /` - Add stock to watchlist
- `PUT /{id}` - Update stock settings
- `DELETE /{id}` - Remove stock from watchlist

### Alerts (http://localhost:8080/api/alerts)
- `GET /` - Get all alerts
- `GET /unread` - Get unread alerts
- `GET /unread/count` - Get count of unread alerts
- `PUT /mark-read` - Mark alerts as read

### API Documentation
- `http://localhost:8080/swagger-ui.html` - Swagger UI Interface
- `http://localhost:8080/v3/api-docs` - OpenAPI JSON Specification

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- PostgreSQL
- Flyway
- JWT Authentication
- Swagger/OpenAPI 3
- Docker

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- Axios
- React Hooks

## Installation and Setup

### Option 1: Docker (Recommended)
```bash
# Run complete application (backend + database)
docker-compose up --build

# Application will be available at:
# - Backend API: http://localhost:8080
# - Frontend: http://localhost:3000
# - Swagger UI: http://localhost:8080/swagger-ui.html
```

### Option 2: Local with Docker PostgreSQL
```bash
# Run only PostgreSQL database
docker-compose up postgres -d

# Run backend locally
mvn spring-boot:run

# Run React frontend
cd frontend
npm install
npm start
```

### Option 3: Completely Local
```bash
# Configure local PostgreSQL database
# Update application.yml with connection details

# Backend
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm start
```

## Configuration

### Environment Variables
- `DATABASE_URL` - PostgreSQL database URL
- `JWT_SECRET` - Secret for JWT token signing
- `REACT_APP_API_URL` - Backend URL for frontend

### Spring Boot Profiles
- `dev` - Development profile
- `docker` - Docker containers profile

## Project Structure

```
StockWatch/
├── src/main/java/           # Backend source code
├── src/main/resources/      # Configuration and migrations
├── frontend/                # React application
├── docker-compose.yml       # Docker configuration
├── Dockerfile              # Backend container
└── pom.xml                 # Maven configuration
```

## Features in Detail

### User Authentication
- Secure JWT-based authentication
- Password encryption with BCrypt
- Token-based session management
- Automatic token refresh

### Stock Monitoring
- Real-time stock price tracking
- Customizable price alerts (min/max thresholds)
- Portfolio management
- Stock categorization and filtering

### Alert System
- Real-time notifications
- Email alerts (configurable)
- Alert history and management
- Unread alert tracking

### Dashboard Features
- Personal portfolio overview
- Stock performance metrics
- Alert configuration
- User-friendly interface

### Trending Stocks
- Popular stocks discovery
- Category-based filtering
- Market data visualization
- Quick add to watchlist

## API Documentation

After running the application, complete API documentation is available at:
http://localhost:8080/swagger-ui.html

### Authentication Required Endpoints
Most endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Example API Usage

#### User Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Add Stock to Watchlist
```bash
curl -X POST http://localhost:8080/api/watchlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "symbol": "AAPL",
    "minPrice": 150.0,
    "maxPrice": 200.0
  }'
```

## Development

### Running Tests
```bash
# Backend tests
mvn test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Backend
mvn clean package

# Frontend
cd frontend
npm run build
```

## Deployment

### Docker Production Deployment
```bash
# Build and run in production mode
docker-compose -f docker-compose.prod.yml up --build
```

### Manual Deployment
1. Build backend: `mvn clean package`
2. Build frontend: `cd frontend && npm run build`
3. Deploy JAR file and static files to your server
4. Configure PostgreSQL database
5. Set environment variables

## Monitoring and Logging

- Application logs are stored in `logs/stockwatch.log`
- Health check endpoint: `http://localhost:8080/actuator/health`
- Metrics endpoint: `http://localhost:8080/actuator/metrics`

## Security Features

- JWT token authentication
- CORS configuration
- SQL injection protection
- XSS protection
- CSRF protection
- Password encryption


## Support

For support and questions, please refer to the API documentation at:
http://localhost:8080/swagger-ui.html
