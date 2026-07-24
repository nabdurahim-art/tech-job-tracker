# Tech Job Tracker

A real-time job aggregation application built with Node.js, Express, and vanilla JS using the Adzuna API.

## Live Deployment & Demo
- **Deployed Website (Load Balanced):** `http://<YOUR_LOAD_BALANCER_IP>`
- **Demo Video:** `https://youtu.be/<YOUR_VIDEO_ID>`

## External API Attribution
- **API Provider:** [Adzuna API](https://developer.adzuna.com/)
- **App ID:** `f2559be8`

## Features
- Real-time job search by keyword and location.
- Interactive data handling (salary sorting and statistics calculation).
- Secure backend API key handling via Express proxy.

## Local Execution Instructions
1. Run `npm install`
2. Ensure `.env` exists with valid `ADZUNA_APP_ID` and `ADZUNA_APP_KEY`
3. Run `node server.js`
4. Access `http://localhost:3000`

## Deployment & Load Balancer Configuration
1. Deployed on two web servers (`Web01` and `Web02`) using PM2 process manager.
2. Configured Nginx on `Lb01` as a round-robin load balancer targeting port 3000 on both web servers.
