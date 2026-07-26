Tech Job Tracker & AnalyticsInfrastructure, Architecture, & API Integration DocumentationProject OverviewThis is a full-stack, enterprise-grade web application engineered to aggregate, analyze, and visualize real-time technology employment metrics utilizing the Adzuna RESTful API.The system is built on a high-availability, fault-tolerant cloud architecture featuring a Node.js/Express backend proxy, a responsive static frontend dashboard, and an HAProxy load balancer distributing traffic across multiple backend web servers.This project fulfills all learning outcomes for external API integration, credential security, robust client/server error handling, high-availability server deployment, and round-robin load balancer configuration.How to AccessLive Application: Visit the live load-balanced endpoint directly via any web browser:http://3.94.184.152How to Run Locally (Interactive Mode)Bashgit clone <YOUR_GITHUB_REPOSITORY_URL>
cd tech-job-tracker
npm install
node server.js
Server runs locally at http://localhost:3000How to Test Proxy Routes (Non-Interactive Mode)Bashcurl -X GET "http://3.94.184.152/api/jobs?what=developer&where=london"
JSON{
  "results": [
    {
      "title": "Software Engineer",
      "company": { "display_name": "Tech Corp" },
      "location": { "display_name": "London" },
      "salary_max": 85000
    }
  ]
}
Environment Variables & Security SetupTo securely proxy requests to the Adzuna API without exposing credentials on the client side, configure a .env file in the project root:Code snippetPORT=3000
ADZUNA_APP_ID=f2559be8
ADZUNA_APP_KEY=d40a0aa2e939e2492056e80b0029428c
Available Endpoints & CommandsEndpoint / CommandUsage / ExampleDescriptionGET /[http://3.94.184.152/](http://3.94.184.152/)Serves the static client dashboard UI.GET /api/jobs[http://3.94.184.152/api/jobs?what=](http://3.94.184.152/api/jobs?what=)<role>&where=<location>Proxies request to Adzuna API with server-side keys.pm2 statuspm2 statusDisplays process status of background server instances.pm2 restartpm2 restart allRestarts Node.js application daemon.pm2 savepm2 saveSaves current process list for automatic reboot recovery.Practical Request Examples1. Fetching Job Market Analytics via Proxy:Bashcurl "http://localhost:3000/api/jobs?what=developer&where=london"
JSON[
  {
    "id": "123456",
    "title": "Senior Frontend Developer",
    "salary_max": 95000,
    "company": "Adzuna Tech"
  }
]
2. Monitoring Load Balancer Traffic Distribution:Bashcurl -i http://3.94.184.152
PlaintextHTTP/1.1 200 OK
Server: Express
X-Served-By: 7130-web-01
Components & File StructurePlaintexttech-job-tracker/
├── config/
│   └── haproxy.cfg        # Infrastructure load balancer configuration
├── index.html             # UI layout and structural containers
├── styles.css             # Responsive styling and dashboard presentation
├── app.js                 # Client-side fetch, dynamic DOM rendering & metrics aggregation
├── server.js              # Express HTTP backend server, security proxy & static asset serving
├── package.json           # Application dependencies and execution scripts
├── .env                   # Environment variables for sensitive API keys (gitignored)
└── README.md              # Technical project documentation
Modules BreakdownFrontend Dashboard (index.html, app.js, styles.css): User interface providing keyword search, location filtering, sorting by salary, and computing aggregate metrics (Total Positions, Avg Upper Salary).API Proxy Server (server.js): Node.js Express server hiding Adzuna API credentials (ADZUNA_APP_ID, ADZUNA_APP_KEY), handling CORS, and serving static files.Load Balancer (config/haproxy.cfg): HAProxy configuration routing incoming HTTP requests round-robin to backend nodes 7130-web-01 and 7130-web-02.Process Manager (PM2): Daemon management ensuring 24/7 background uptime across SSH session closures and server reboots.Architecture & Data FlowAll client requests pass through a load-balanced network topology to ensure maximum uptime and security.Request Flow:Browser / Client $\rightarrow$ HAProxy (3.94.184.152) $\rightarrow$ Web Server (7130-web-01 / web-02) $\rightarrow$ Express Proxy (/api/jobs) $\rightarrow$ Adzuna APIClient Interaction: User submits search criteria via dashboard interface.Load Balancing: HAProxy receives traffic on 7130-lb-01 (3.94.184.152) and routes it via round-robin to an active backend server.API Proxying: Express attaches protected API credentials on the server side and requests data from Adzuna.Data Aggregation & Rendering: JSON response is safely returned to the client DOM, rendering individual job cards and calculating statistical metrics.Error Handling & ResiliencyClient-Side Validation: Displays user-friendly error alerts when invalid location queries (e.g., unsupported country names) or network failures occur.Server-Side Resilience: Gracefully catches API timeouts or bad responses from Adzuna, returning structured HTTP status codes (400, 500) without crashing the server process.Daemon Persistence: Server instances are maintained via PM2, allowing terminals to be closed safely without causing downtime.Resource Attribution & CreditsData Provider: Employment listings and salary analytics powered by Adzuna API.Infrastructure Software: HAProxy Load Balancer & PM2 Runtime Process Manager.Backend Framework: Express.js / Node.js.AuthorsNshimiyimana Abdurahim
