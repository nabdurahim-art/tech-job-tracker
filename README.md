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

### How to Run Locally (Interactive Mode)

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd tech-job-tracker
npm install
node server.js
