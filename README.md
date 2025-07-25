# Track-Business: Business Management Platform

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)![GitHub stars](https://img.shields.io/github/stars/namanabbad02/Track-Business?style=social)![GitHub forks](https://img.shields.io/github/forks/namanabbad02/Track-Business?style=social)

A web-based platform built with the  Express.js React Node.js and MySQL for users to track and manage business activities—including clients, projects, finances, invoices, and tasks—with secure, multi-user and role support.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture Diagram](#architecture-diagram)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [What I Learned](#what-i-learned)
- [License](#license)



## Overview

Track-Business is a comprehensive, web-based platform designed to help admin/users efficiently manage their business operations. It provides a suite of tools for tracking clients, projects, finances, invoices, and tasks in a secure, multi-user environment. The application is built with a scalable and modular architecture, making it easy to maintain and extend.

## Key Features

-   **User Authentication & Authorization:** Implemented via JWT (JSON Web Tokens) with secure password hashing by bcrypt.js.
-   **Role-Based Access Control:** Differentiated permissions for users (e.g., admin, manager, staff).
-   **Modular REST API:** Separate routes, controllers, and models for clients, projects, finances, invoices, and tasks, built using Express.js for scalable endpoint management.
-   **Data Persistence with MySQL:** Structured schemas for Users, Clients, Projects, Invoices, and Tasks.
-   **Business Workflow Automation:** Full CRUD operations for tracking invoices, recording payments, managing project statuses, and assigning tasks.
-   **Error Handling & Validation:** Centralized middleware for error catching, JWT validation, and request input checking using `express-validator`.
-   **Clean Code Organization:** A well-structured codebase with distinct folders for controllers, models, routes, middleware, and configuration.

## Architecture Diagram

```

+----------------+      +----------------+      +----------------+
|                |      |                |      |                |
|     React      |----->|   Express.js   |----->|      MySQL     |
|   Frontend     |      |    (Backend)   |      |    Database    |
|                |      |                |      |                |
+----------------+      +--------+-------+      +----------------+
                                 |
                                 |
                         +-------v----------+
                         |                  |
                         |        JWT       |
                         |(Auth Middleware) |
                         |                  |
                         +------------------+


```


---


## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Database:** MySQL
-   **Authentication:** JSON Web Tokens (JWT), bcrypt.js
-   **Validation:** `express-validator`
-   **Development Tools:** ESLint, Nodemon, Prettier


---


## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.





### Prerequisites

-   Node.js (v14 or higher)
-   npm (v6 or higher)
-   MySQL Server





### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/namanabbad02/Track-Business.git
    cd Track-Business
    ```

2.  **Install server dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=track_business
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

1.  **Start the MySQL server.**

2.  **Start the development server:**
    ```sh
    npm run dev
    ```
    The server will start on `http://localhost:5000`.




## API Endpoints

The API is organized into the following modules:

-   **Auth:** `/api/auth/register`, `/api/auth/login`
-   **Clients:** `/api/clients` (GET, POST), `/api/clients/:id` (GET, PUT, DELETE)
-   **Projects:** `/api/projects` (GET, POST), `/api/projects/:id` (GET, PUT, DELETE)
-   **Invoices:** `/api/invoices` (GET, POST), `/api/invoices/:id` (GET, PUT, DELETE)
-   **Tasks:** `/api/tasks` (GET, POST), `/api/tasks/:id` (GET, PUT, DELETE)



## What I Learned

-   **Secure User Authentication & Role-Based Access:** Designed and implemented a robust authentication system using JWT and role-based permissions.
-   **Modular REST API Architecture:** Created a scalable and maintainable API with a clear separation of concerns.
-   **Relational Data Modeling:** Modeled complex business data using MySQL schemas.
-   **Centralized Error & Validation Handling:** Implemented centralized middleware for reliable error catching and input validation.
-   **Environment Configuration:** Utilized environment variables for scalable deployment and easy environment management.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 📬 Contact

Naman Jain - [Linkedin: https://www.linkedin.com/in/naman-n-jain] - abbadnaman@gmail.com
