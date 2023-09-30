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

## Tech Stack 🛠️
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
- 🐳 Docker [install](https://docs.docker.com/engine/install/)

- 🐳 Docker Compose [install](https://docs.docker.com/compose/install/)

- 🐍 Python ^3.10 [install](https://www.python.org/downloads/)

- 📚 Poetry [install](https://python-poetry.org/docs/)

Download them unless you enjoy error messages. 😉

## Quick Setup - How to get it running quickly 🚀
```bash
# Fetch all the Python dependencies
cd backend && poetry install --only run

# Spawn virtual environment shell
poetry shell

# Build docker images
inv build

# Flush the database, run migrations, create a superuser, load fixtures.
inv reset
```

## Development Setup - Additional steps 🛠️
```bash
cd backend && poetry install --with dev

# Install pre-commit hooks
pre-commit install

# Run pre-commit hooks on all files
pre-commit run --all-files
```

## Invoke Usage 📖  📦
```bash
# Start the containers
inv up

# Stop the containers. -v removes volumes
inv down [-v]

# Check logs
inv logs {container_name}

# Open bash
inv bash {container_name}

# Run django migrations
inv migrate [--rm] [--migrate]

# Restart a container
inv restart {container_name}
```



## License 📝
MIT License. See [LICENSE](LICENSE) for more information.


