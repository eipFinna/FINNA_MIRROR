# Project Title: FINNA

## Overview
FINNA is a web application that provides functionalities for keyword extraction and article summarization using AI models. The application consists of a Node.js backend and a Flask service for handling AI-related tasks.

## Project Structure
The project is organized into the following directories and files:

- **.env**: Contains environment variables for the application.
- **.gitignore**: Specifies files and directories to be ignored by Git.
- **app.js**: Entry point of the Node.js application, setting up the Express server.
- **package.json**: Configuration file for npm, listing dependencies and scripts.
- **requirements.txt**: Lists Python dependencies required for the Flask application.
- **config/**: Contains configuration files for the application.
- **controllers/**: Contains controllers for handling various application logic.
- **middlewares/**: Contains middleware for error handling.
- **models/**: Contains data models used in the application.
- **routes/**: Defines the routes for the application.
- **services/**: Contains services for interacting with AI and database functionalities.
- **services/python_api/**: Contains the Flask application and scripts for AI model handling.
- **Dockerfile.node**: Instructions to build the Docker image for the Node.js server.
- **Dockerfile.flask**: Instructions to build the Docker image for the Flask server.
- **docker-compose.yml**: Defines services, networks, and volumes for the Docker application.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Python 3.x and Node.js installed (for local development).

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd backend
   ```

2. Create a `.env` file in the `backend` directory and add your environment variables.

3. Install Node.js dependencies:
   ```
   npm install
   ```

4. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

### Running the Application
To run the application using Docker, execute the following command in the `backend` directory:
```
docker-compose up --build
```

This command will build the Docker images for both the Node.js and Flask services and start the containers.

### Accessing the Application
- The Node.js server will be accessible at `http://localhost:5000`.
- The Flask API will be accessible at `http://localhost:5001`.

### Usage
- Use the `/search` endpoint to search for articles and get summaries.
- Use the `/register` endpoint to register new users.
- Use the `/login` endpoint to authenticate users.
- Use the `/feedback` endpoint to submit feedback.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.