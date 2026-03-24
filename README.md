#  Weather-Aware Autonomous Delivery Agent

##  Overview

This project simulates an **AI-driven delivery automation system** that proactively detects weather-based disruptions and autonomously takes action.

Instead of a simple script, this system is designed as a **mini agentic workflow engine** that:
- Observes external signals (weather API)
- Makes structured decisions (delay, priority, escalation)
- Executes actions (customer notification, escalation)
- Maintains system resilience under failures

This directly mirrors real-world **ITSM automation workflows** used in enterprise environments.

---

##  Problem Statement

Delivery systems are often reactive, leading to poor customer experience during disruptions.

This system solves that by:
- Detecting risks early using real-time weather data
- Making intelligent decisions
- Communicating proactively with customers

---

##  Agentic Workflow Design

The system follows an **Observe → Decide → Act → Report** model:

[ORDER INGESTION]
↓
[PARALLEL WEATHER FETCH]
↓
[AI DECISION ENGINE]
↓
[DELAY DETECTION & PRIORITIZATION]
↓
[ACTION EXECUTION (NOTIFY / ESCALATE)]
↓
[ORDER UPDATE & REPORTING]

---

##  Key Features

### 1. Parallel Processing
- Uses `Promise.all` to process multiple orders concurrently
- Ensures scalability and efficiency

---

### 2. Decision Engine (Agent Brain)
- Maps weather conditions to:
  - Severity
  - Delay decision
  - Priority
  - Action (Notify / Escalate)
- Includes explainability for each decision

---

### 3. Intelligent Messaging
- Generates contextual, customer-specific delay messages
- Simulates AI-driven communication

---

### 4. Resilient Error Handling
- Handles invalid cities gracefully
- Retry logic for transient API failures
- Prevents full system crashes

---

### 5. Structured Logging & Reporting
- Timestamped logs
- Final system summary:
  - Processed orders
  - Delays
  - Escalations
  - Errors

---

### 6. Demo Mode (Controlled Scenario Simulation)
To ensure consistent demonstration of all workflows:

- New York → Rain → Delay  
- Mumbai → Thunderstorm → Escalation  
- London → Clear → No delay  

This ensures all system branches are exercised.

---

##  Project Structure

[ORDER INGESTION]
↓
[PARALLEL WEATHER FETCH]
↓
[AI DECISION ENGINE]
↓
[DELAY DETECTION & PRIORITIZATION]
↓
[ACTION EXECUTION (NOTIFY / ESCALATE)]
↓
[ORDER UPDATE & REPORTING]


---

##  Environment Setup

Create a `.env` file:

API_KEY=your_openweathermap_api_key
DEMO_MODE=true


---

##  How to Run

```bash
npm install
node src/index.js

AI DELIVERY AGENT REPORT

Total Orders:      4
Processed:         3
Delayed:           2
Escalations:       1
Errors:            1

System Status:     DEGRADED