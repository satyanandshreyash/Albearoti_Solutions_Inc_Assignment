# Task Management API

This is a RESTful API for a Task Management application built using Node.js, Express.js, and MongoDB. The API allows users to manage tasks with authentication and provides CRUD operations for tasks such as creating, reading, updating, and deleting.

## Features

- **User Authentication**: Register and login users with JWT-based authentication.
- **Task CRUD Operations**:
  - Create, read, update, and delete tasks.
  - Each task includes a title, description, status (`pending`, `in-progress`, `completed`), and a due date.
  - Each task is associated with the user who created it.
- **Input Validation**: Validates input data for all endpoints using Joi.
- **Error Handling**: Comprehensive error handling for invalid input and authorization errors.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT (JSON Web Token)**
- **Joi** (for input validation)
- **dotenv** (for environment variables)

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed and running locally or hosted on a cloud service (e.g., MongoDB Atlas)

## Getting Started

### Clone the repository

```bash
git clone https://github.com/satyanandshreyash/Albearoti_Solutions_Inc_Assignment.git
cd Albearoti_Solutions_Inc_Assignment
```
### Install dependencies

```bash
npm install
```
### Set up environment variables

Create a .env file in the root of your project and add the following:

```makefile
mongoUrl=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret_key
PORT=5000
```
mongoUrl=mongodb://localhost:27017/<your_Database_Name> if using for local testing otherwise use the connection string from your cluster.

### Run the application
```bash
node index.js
```
The server should now be running on `http://localhost:5000`.

## API Endpoints

### Authentication
#### Register a new user
- **URL**: http://localhost:8000/registration
- **Method**: POST
- **Body**: 
```json
{
    "username": "Test",
    "email": "test@gmail.com",
    "password": "test123"
}
```
- **Response**:
```json
{   
    user: {your_user_object}, 
    accessToken: your_access_token,
    message: "Registration Successful"
}   
```
#### Login
- **URL**: http://localhost:8000/login
- **Method**: POST
- **Body**: 
```json
{
    "email": "test@gmail.com",
    "password": "test123"
}
```
- **Response**:
```json
{   
    message: "Login Successful",
    email: "test@gmail.com",
    accessToken: your_access_token
}   
```
## Tasks
### CRUD Operations
#### Create Task

- **URL**: http://localhost:8000/create-task
- **Method**: POST
- **Headers**: `Authorization: Bearer your_jwt_token`
- **Body**: 
```json
{
    "title": "Complete API Documentation",
    "description": "Finish writing the documentation for the task management API.",
    "status": "in-progress",
    "dueDate": "2024-09-30"
}
```
- **Response**:
```json
{
    "task": {
        "title": "Complete API Documentation",
        "description": "Finish writing the documentation for the task management API.",
        "status": "in-progress",
        "dueDate": "2024-09-30T00:00:00.000Z",
        "userId": "your_user_id,
        "_id": your_task_id,
        "__v": 0
    },
    "message": "Task added Successfully"
} 
```

#### Read all Tasks
- **URL**: http://localhost:8000/get-all-tasks
- **Method**: POST
- **Headers**: `Authorization: Bearer your_jwt_token`

- **Response**:
```json
[
    {
        "title": "Complete API Documentation",
        "description": "Finish writing the documentation for the task management API.",
        "status": "in-progress",
        "dueDate": "2024-09-30T00:00:00.000Z",
        "userId": "your_user_id,
        "_id": your_task_id,
        "__v": 0
    },
    ...
]
```
#### Update Task

- **URL**: http://localhost:8000/update-task/:taskId
- **Method**: PUT
- **Headers**: `Authorization: Bearer your_jwt_token`
- **Body**: 
```json
{
  "title": "Updated Task Title",
  "description": "Updated task description",
  "status": "in-progress",
  "dueDate": "2024-10-15"
}

```
- **Response**:
```json
{
    task: {
        "_id": "task_id",
        "title": "Updated Task Title",
        "description": "Updated task description",
        "status": "in-progress",
        "dueDate": "2024-10-15T00:00:00.000Z",
        "user": "user_id",
        "__v": 0
    },
    message: "Task updated successfully"
}
```
#### Delete Task

- **URL**: http://localhost:8000/delete-task/:taskId
- **Method**: DELETE
- **Headers**: `Authorization: Bearer your_jwt_token`
- **Response**:
```json
{
  "message": "Task removed"
}

```

## Error Handling
- **400 Bad Request**: Returned when invalid data is provided.
- **401 Unauthorized**: Returned when a user tries to access a protected route without a valid token.
- **404 Not Found**: Returned when a resource (e.g., task) is not found.
- **500 Internal Server Error**: Returned when there's an issue on the server.
