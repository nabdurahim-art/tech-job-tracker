# Tech Job Tracker & Analytics

> **Infrastructure, Architecture, & API Integration Documentation**

---

## Project Overview

This is a full-stack, enterprise-grade web application engineered to aggregate, analyze, and visualize real-time technology employment metrics utilizing the **Adzuna RESTful API**. 

The system is built on a high-availability, fault-tolerant cloud architecture featuring a Node.js/Express backend proxy, a responsive static frontend dashboard, and an HAProxy load balancer distributing traffic across multiple backend web servers. 

This project fulfills all learning outcomes for external API integration, credential security, robust client/server error handling, high-availability server deployment, and round-robin load balancer configuration.

---

## How to Access

* **Live Application:** Visit the live load-balanced endpoint directly via any web browser:  
  [http://3.94.184.152](http://3.94.184.152)

* **Demo video link : **
  https://www.loom.com/share/679ae1dc0aa44419b4f2899bc1080356

### How to Run Locally (Interactive Mode)

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd tech-job-tracker
npm install
node server.js

Server runs locally at http://localhost:3000

## How to Test Proxy Routes (Non-Interactive Mode)
curl -X GET "[http://3.94.184.152/api/jobs?what=developer&where=london](http://3.94.184.152/api/jobs?what=developer&where=london)"

{
  "results": [
    {
      "title": "Software Engineer",
      "company": { "display_name": "Tech Corp" },
      "location": { "display_name": "London" },
      "salary_max": 85000
    }
  ]
}

##Environment Variables & Security Setup

To securely proxy requests to the Adzuna API without exposing credentials on the client side, configure a .env file in the project root:

Code snippet
PORT=3000
ADZUNA_APP_ID=f2559be8
ADZUNA_APP_KEY=d40a0aa2e939e2492056e80b0029428c

## Available Endpoints & Commands

| Endpoint / Command | Usage / Example | Description |
| :--- | :--- | :--- |
| **`GET /`** | `http://3.94.184.152/` | Serves the static client dashboard UI. |
| **`GET /api/jobs`** | `http://3.94.184.152/api/jobs?what=<role>&where=<location>` | Proxies request to Adzuna API with server-side keys. |
| **`pm2 status`** | `pm2 status` | Displays process status of background server instances. |
| **`pm2 restart`** | `pm2 restart all` | Restarts Node.js application daemon. |
| **`pm2 save`** | `pm2 save` | Saves current process list for automatic reboot recovery. |

##Practical Request Examples
1. Fetching Job Market Analytics via Proxy:
curl "http://localhost:3000/api/jobs?what=developer&where=london"

JSON 
[
  {
    "id": "123456",
    "title": "Senior Frontend Developer",
    "salary_max": 95000,
    "company": "Adzuna Tech"
  }
]

## 2. Monitoring Load Balancer Traffic Distribution:
curl -i [http://3.94.184.152](http://3.94.184.152)

Plaintext
HTTP/1.1 200 OK
Server: Express
X-Served-By: 7130-web-01

## Components & File Structure

tech-job-tracker/
├── config/
│   └── haproxy.cfg        # Infrastructure load balancer configuration
├── index.html             # UI layout and structural containers
├── styles.css             # Responsive styling and dashboard presentation
├── app.js                 # Client-side fetch, dynamic DOM rendering & metrics aggregation
├── server.js              # Express HTTP backend server, security proxy & static asset serving
├── package.json           # Application dependencies and execution scripts
├── .env                   # Environment variables for sensitive API keys (gitignored)
└── README.md              # Technical project documentation

## Modules Breakdown
Frontend Dashboard (index.html, app.js, styles.css): User interface providing keyword search, location filtering, sorting by salary, and computing aggregate metrics (Total Positions, Avg Upper Salary).

API Proxy Server (server.js): Node.js Express server hiding Adzuna API credentials (ADZUNA_APP_ID, ADZUNA_APP_KEY), handling CORS, and serving static files.

Load Balancer (config/haproxy.cfg): HAProxy configuration routing incoming HTTP requests round-robin to backend nodes 7130-web-01 and 7130-web-02.

Process Manager (PM2): Daemon management ensuring 24/7 background uptime across SSH session closures and server reboots.

## Architecture & Data Flow
All client requests pass through a load-balanced network topology to ensure maximum uptime and security.

# Request Flow:
Browser / Client $\rightarrow$ HAProxy (3.94.184.152) $\rightarrow$ Web Server (7130-web-01 / web-02) $\rightarrow$ Express Proxy (/api/jobs) $\rightarrow$ Adzuna API

1. Client Interaction: User submits search criteria via dashboard interface.

2. Load Balancing: HAProxy receives traffic on 7130-lb-01 (3.94.184.152) and routes it via round-robin to an active backend server.

3. API Proxying: Express attaches protected API credentials on the server side and requests data from Adzuna

4. Data Aggregation & Rendering: JSON response is safely returned to the client DOM, rendering individual job cards and calculating statistical metrics.

## Error Handling & Resiliency

Client-Side Validation: Displays user-friendly error alerts when invalid location queries (e.g., unsupported country names) or network failures occur.

Server-Side Resilience: Gracefully catches API timeouts or bad responses from Adzuna, returning structured HTTP status codes (400, 500) without crashing the server process.

Daemon Persistence: Server instances are maintained via PM2, allowing terminals to be closed safely without causing downtime.

## Resource Attribution & Credits

Data Provider: Employment listings and salary analytics powered by Adzuna API.

Infrastructure Software: HAProxy Load Balancer & PM2 Runtime Process Manager.

Backend Framework: Express.js / Node.js.

Author
Nshimiyimana Abdurahim
