# Chat App Backend

This is the backend for a real-time chat application built with **Node.js**, **Express**, and **MongoDB**. The backend handles user authentication, message storage, and communication with the frontend.

## Table of Contents
- [Installation](#installation)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
  - [POST /signup](#post-signup)
  - [POST /login](#post-login)
  - [GET /api/messages/:userId](#get-apimessagesuserid)
- [Technologies Used](#technologies-used)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/chat-app-backend.git
    cd chat-app-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up your MongoDB instance:
    - You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB setup.
    - Update the `mongoURI` in `db.js` to point to your MongoDB instance.

4. Create a `.env` file in the root directory and add the following:
    ```bash
    JWT_SECRET=your_jwt_secret_key
    ```

5. Start the server:
    ```bash
    npm start
    ```

The server will run on `http://localhost:5000`.

## Setup

1. Make sure MongoDB is running locally or use MongoDB Atlas for remote access.
2. The backend provides JWT-based authentication, so make sure to use it in the frontend.

## API Endpoints

### POST /signup

Registers a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "your_password"
}
