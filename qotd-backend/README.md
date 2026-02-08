QOTD (Question of the Day) Backend API
A backend system for managing daily coding challenges in an edtech platform.

🚀 Live Deployment
Base URL: https://qotd-backend.onrender.com

📋 Features
✅ Get today's coding question

✅ Submit solutions with evaluation

✅ View statistics and leaderboards

✅ RESTful API with proper error handling

✅ No authentication required (as per requirements)

🛠️ Tech Stack
Runtime: Node.js

Framework: Express.js

Database: In-memory storage

Middleware: CORS, dotenv

Deployment: Render

📁 Project Structure
text
qotd-backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Data models & in-memory DB
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── app.js          # Main application
├── .env                # Environment variables
├── package.json        # Dependencies
└── README.md           # Documentation
🚦 API Endpoints
1. Health Check
http
GET /api/health
Response:

json
{
  "status": "OK",
  "message": "QOTD API is running"
}
2. Get Today's Question
http
GET /api/questions/today
Response:

json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Two Sum",
    "difficulty": "Easy",
    "problemStatement": "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    "sampleInput": "nums = [2,7,11,15], target = 9",
    "sampleOutput": "[0,1]",
    "hints": ["Try using a hash map", "Think about time complexity"],
    "date": "2024-01-20",
    "category": "Array"
  },
  "hintCount": 2
}
3. Get Question by ID
http
GET /api/questions/:id
4. Submit Solution
http
POST /api/submissions
Content-Type: application/json

{
  "userId": "user123",
  "questionId": "1",
  "code": "function solve() { return [0,1]; }",
  "language": "javascript"
}
Response:

json
{
  "success": true,
  "data": {
    "submissionId": "1705766400000",
    "isCorrect": true,
    "result": "Correct! All test cases passed.",
    "timeTaken": 45
  }
}
5. Get User Submissions
http
GET /api/submissions/user/:userId
6. Get Statistics
http
GET /api/stats
Response:

json
{
  "success": true,
  "data": {
    "overall": {
      "totalAttempts": 0,
      "correctSubmissions": 0,
      "successRate": "0.00%"
    },
    "today": {
      "questionId": "1",
      "title": "Two Sum",
      "difficulty": "Easy",
      "attempts": 0,
      "correctToday": 0
    }
  }
}
7. Get Leaderboard
http
GET /api/stats/leaderboard
Response:

json
{
  "success": true,
  "data": []
}
8. Get Question Statistics
http
GET /api/stats/question/:questionId
🏃‍♂️ Local Development
Prerequisites
Node.js (v16 or higher)

npm or yarn

Installation
bash
# Clone repository
git clone https://github.com/yourusername/qotd-backend.git
cd qotd-backend

# Install dependencies
npm install

# Create environment file
echo "PORT=3000" > .env
echo "NODE_ENV=development" >> .env
Environment Variables
Create a .env file:

env
PORT=3000
NODE_ENV=development
Running the Server
bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
Testing the API
Once running, test endpoints:

bash
# Health check
curl http://localhost:3000/api/health

# Today's question
curl http://localhost:3000/api/questions/today

# Submit a solution
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","questionId":"1","code":"console.log(\"hello\")"}'
🗃️ Data Models
Question
javascript
{
  id: String,
  title: String,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  problemStatement: String,
  sampleInput: String,
  sampleOutput: String,
  expectedOutput: String,  // Hidden from students
  hints: Array<String>,
  date: String,  // YYYY-MM-DD format
  category: String
}
Submission
javascript
{
  id: String,
  userId: String,
  questionId: String,
  code: String,
  language: String,
  isCorrect: Boolean,
  result: String,
  timeTaken: Number,  // in seconds
  submittedAt: String  // ISO timestamp
}
🧪 Mock Evaluation
The system uses a mock evaluation service that:

Returns random results (70% correct, 30% incorrect)

Simulates different error scenarios (timeout, runtime errors, test failures)

In production, this would be replaced with actual code execution in a Docker sandbox

🔧 Configuration
Port Configuration
Default: 3000

Override via .env file or environment variable

In-memory Data
Questions are hardcoded in src/models/inMemoryDB.js

Two sample questions provided: "Two Sum" (today) and "Reverse String" (yesterday)

Data persists until server restart

Add more questions by modifying the questions array

🚀 Deployment
Deploying to Render
Push code to GitHub repository

Create new Web Service on Render.com

Connect your GitHub repository

Configure settings:

Build Command: npm install

Start Command: npm start

Environment Variables: Add PORT (Render auto-assigns)

Click "Create Web Service" and wait for deployment

Environment Variables for Production
env
PORT=10000  # Render assigns port automatically
NODE_ENV=production
📈 Performance
Response time: < 100ms for most endpoints

Supports concurrent requests

No database latency (in-memory storage)

Stateless architecture ready for horizontal scaling

🔮 Future Improvements
With more time, I would:

Add Real Code Execution

Docker sandbox for secure code execution

Multiple test cases per question with hidden tests

Time and memory limits for submissions

Support for multiple programming languages

Database Integration

MongoDB/PostgreSQL for persistent storage

User authentication with JWT tokens

Question scheduling system (cron jobs)

Data backup and recovery

Enhanced Features

Hint system with cooldown and progressive hints

Discussion forums for each question

Personalized question recommendations based on performance

Detailed analytics dashboard with graphs

Question difficulty adjustment based on success rate

Scalability

Redis for caching frequently accessed questions

Load balancing across multiple instances

Rate limiting to prevent abuse

API versioning for backward compatibility

WebSocket support for real-time leaderboard updates

Testing & Monitoring

Unit tests with Jest/Mocha

Integration tests for API endpoints

API documentation with Swagger/OpenAPI

Error tracking with Sentry

Performance monitoring with New Relic

Log aggregation with ELK stack

Security Enhancements

Input sanitization and validation

SQL injection prevention

XSS protection

API key authentication for external access

DDoS protection

User Experience

Email notifications for new daily questions

Mobile app with push notifications

Dark mode theme

Code syntax highlighting

Social features (follow friends, share achievements)

🐛 Error Handling
The API returns appropriate HTTP status codes:

200: Success

201: Resource created (successful submission)

400: Bad request (missing/invalid parameters)

404: Resource not found (invalid question ID)

500: Internal server error

All error responses follow this format:

json
{
  "success": false,
  "error": "Descriptive error message"
}
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is created for interview assessment purposes. Not for commercial use.

👤 Author
Interview Candidate

Task completed for: TechLearn Solutions Backend Interview

Date: January 2024

Position: Backend Developer

🙏 Acknowledgements
TechLearn Solutions for the comprehensive interview task requirements

Express.js team for the robust and minimalist web framework

Render.com for providing free hosting for demo projects

The open-source community for countless libraries and tools

All interview candidates who inspire continuous learning and improvement

