# Inferred 🚀

## Overview
Welcome to Inferred, the snazzy dashboard for assessing the adequacy of simulation models in digital twin applications. We've got real-time data, Python, ReactJS, and more! 😎

## Key Features

- **Real-Time Sensor Data**: Incorporating a high-throughput data pipeline capable of ingesting, processing, and displaying real-time sensor data.
- **Simulation Model Analytics**: Utilizes statistical models and machine learning algorithms to validate and analyze simulation models against real-world data.
- **Metrics and Comparisons**: Allows for the measurement and juxtaposition of various metrics, providing insights into system performance and reliability.
  
---

<p float="left">
  <img src="https://github.com/Raff-dev/inferred/assets/56380303/92432d3f-9b31-4a16-9e0a-43d94884f845" width="49%" />
  <img src="https://github.com/Raff-dev/inferred/assets/56380303/87410904-b1cb-41d3-a175-3f40fc4fc014" width="49%" /> 
</p>

---

<p float="left">
<img  width="49%" alt="image" src="https://github.com/Raff-dev/inferred/assets/56380303/54edcaab-8f7d-463c-a8d8-3a67cc167b59">
<img width="49%" alt="image" src="https://github.com/Raff-dev/inferred/assets/56380303/fcc64148-f9c7-429b-ad7c-dae7fc17bb2d">
</p>

---

Tech Stack 🛠️
- Backend: [Django](https://www.djangoproject.com/)
- Frontend: [ReactJS](https://reactjs.org/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- Caching: [Redis](https://redis.io/)
- Message Broker: [Celery with Redis](https://docs.celeryproject.org/en/stable/getting-started/brokers/redis.html)
- Containerization: [Docker](https://www.docker.com/)
- Package Management: [Poetry](https://python-poetry.org/)
- Code Quality: [Pre-commit](https://pre-commit.com/)

## System Architecture

### Backend
Utilizes a Django-based RESTful API in conjunction with Celery for asynchronous task management. This ensures a scalable and extensible backend system capable of handling high volumes of data.

### Frontend
Leverages the capabilities of ReactJS to provide an intuitive and responsive user interface.

### Mock
Includes mock services that emulate various subsystems, facilitating a controlled environment for testing and development.

### Task Management
Employs `Invoke` for task automation, orchestrating complex multi-container operations with simple commands.

### Container Orchestration
Uses a Docker Compose YAML file to handle container orchestration, streamlining the deployment and scaling processes.



## Pre-requisites 📋
Must-haves for a smooth ride:
- Docker 🐳
- Python ^3.10 🐍
- Poetry 📚
- Pre-commit 🚫

Download them unless you enjoy error messages. 😉

## Setup 🚀
1. Install Poetry if you haven't already:
```
pip install poetry
```
2. Run this to fetch all Python dependencies 📦.
```
poetry install
```
3. Make sure you get all those migrations going:
```
inv migrate
```
4. To get the whole system up and running, just use:
```
inv up
```

## Container Management with Invoke 🎩
Need to boss around containers? Invoke's got you:
- **Logs**: `inv logs <container_name>`
- **Up**: `inv up`
- **Down**: `inv down [--v]`
- **Restart**: `inv restart <container_name>`
- **Bash**: `inv bash <container_name>`
- **Migrate**: `inv migrate [--make] [--rm]`
- **Build**: `inv build`
- **Flush**: `inv flush`

## License 📝
MIT License, because we're all friends here.


