# Berlin Clock (Mengenlehreuhr)

A full-stack implementation of the famous Berlin Clock (Mengenlehreuhr) - the unique time-telling device that uses colored lamps instead of traditional digits.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Real-Time Mode**: Live Berlin Clock display showing current time
- **Convert Mode**: Convert standard time (HH:mm:ss) to Berlin Clock format
- **Decode Mode**: Interactive Berlin Clock where you can click lamps to decode time
- **Info Mode**: Comprehensive explanation of how the Berlin Clock works

## Quick Start

### Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and **npm**

Or alternatively:

- **Docker** and **Docker Compose**

## Option 1: Run Locally (Recommended for Development)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/berlinclock-standalone.git
cd berlinclock-standalone
```

### 2. Start Backend (Spring Boot)

Open a terminal and run:

```bash
cd backend
./mvnw spring-boot:run
```

The backend API will be available at **http://localhost:8080**

### 3. Start Frontend (React + Vite)

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:5173**

### 4. Access the Application

Open your browser and navigate to **http://localhost:5173**

## Option 2: Run with Docker Compose

The easiest way to run the entire application:

```bash
# Start both backend and frontend
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

Access the application at **http://localhost**

To stop the containers:

```bash
docker-compose down
```

## How the Berlin Clock Works

The Berlin Clock displays time using colored lamps arranged in 5 rows:

1. **Seconds Lamp (Top)**: Yellow circle that blinks on/off every second
   - ON (Y) = odd seconds
   - OFF (O) = even seconds

2. **Five Hours Row**: 4 red lamps, each representing 5 hours
   - Each lit lamp = 5 hours

3. **Single Hours Row**: 4 red lamps, each representing 1 hour
   - Each lit lamp = 1 hour

4. **Five Minutes Row**: 11 lamps, each representing 5 minutes
   - Every 3rd lamp is red (quarter hours)
   - Other lamps are yellow
   - Each lit lamp = 5 minutes

5. **Single Minutes Row**: 4 yellow lamps, each representing 1 minute
   - Each lit lamp = 1 minute

### Example: 13:32:45

- **Seconds**: Y (odd second)
- **Hours**: 2 lamps in five-hours + 3 lamps in single-hours = 13 hours
- **Minutes**: 6 lamps in five-minutes + 2 lamps in single-minutes = 32 minutes

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/time` | Get current time in Berlin Clock format |
| GET | `/api/time/convert?time=HH:mm:ss` | Convert standard time to Berlin Clock |
| POST | `/api/time/decode` | Decode Berlin Clock format to standard time |

### Example API Calls

```bash
# Get current time
curl http://localhost:8080/api/time

# Convert specific time
curl http://localhost:8080/api/time/convert?time=13:32:45

# Decode Berlin Clock
curl -X POST http://localhost:8080/api/time/decode \
  -H "Content-Type: application/json" \
  -d '{
    "secondsLamp": "Y",
    "fiveHoursRow": "RROO",
    "singleHoursRow": "RRRO",
    "fiveMinutesRow": "YYRYYROOOOO",
    "singleMinutesRow": "YYOO"
  }'
```

## Running Tests

### Backend Tests

```bash
cd backend
./mvnw test
```

All 51 tests should pass, including:
- Unit tests for BerlinClockService
- Integration tests for REST API endpoints
- Encode and decode functionality tests

### Frontend Tests

```bash
cd frontend
npm test
```

### Code Coverage

```bash
cd backend
./mvnw clean test jacoco:report
```

View the coverage report at: `backend/target/site/jacoco/index.html`

## Project Structure

```
berlinclock-standalone/
├── backend/                   # Spring Boot backend
│   ├── src/
│   │   ├── main/java/        # Application code
│   │   └── test/java/        # Tests
│   ├── pom.xml               # Maven configuration
│   ├── Dockerfile            # Backend Docker image
│   └── mvnw                  # Maven wrapper
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   └── types/            # TypeScript types
│   ├── package.json          # npm configuration
│   ├── Dockerfile            # Frontend Docker image
│   └── vite.config.ts        # Vite configuration
├── docker-compose.yml        # Docker Compose setup
└── README.md                 # This file
```

## Technologies Used

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Maven**
- **JUnit 5** (Testing)
- **JaCoCo** (Code coverage)

### Frontend
- **React 18**
- **TypeScript 5**
- **Vite**
- **Vitest** (Testing)
- **CSS3** (Custom styling)

## Troubleshooting

### Backend won't start

Make sure port 8080 is not in use:

```bash
# Linux/Mac
lsof -i :8080

# Windows
netstat -ano | findstr :8080
```

### Frontend can't connect to backend

1. Verify backend is running on port 8080
2. Check the proxy configuration in `frontend/vite.config.ts`
3. Make sure there are no CORS issues

### Docker containers won't start

```bash
# Check Docker logs
docker-compose logs

# Rebuild containers
docker-compose down
docker-compose up --build
```

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by the original Mengenlehreuhr created by Dieter Binninger in 1975
- Berlin Clock located at Kurfürstendamm in Berlin, Germany

---

**Enjoy building with the Berlin Clock!**
