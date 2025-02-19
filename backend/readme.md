# Task Scheduler Backend

## Overview

The Task Scheduler Backend is built to support the Task Scheduler application. It provides an API that handles user authentication, task management, notifications, and other related services. This backend is developed using **Node.js**, **TypeScript**, and **Express** and uses **MongoDB** for storing task and user data.

The backend serves endpoints for handling tasks such as adding, deleting, updating, and fetching tasks, as well as user-related functionalities like login, registration, and password resets. It also supports sending notifications, email services, and cron jobs for scheduled tasks.

---

## All Commands in `package.json`

Here’s a breakdown of the available commands defined in `package.json` for this backend project:

- **`start`**:

  - Command: `nodemon -r tsconfig-paths/register ./src/index.ts`
  - Starts the backend server in development mode with `nodemon`, enabling hot-reloading. It registers path aliases defined in `tsconfig.json`.

- **`start:cron`**:

  - Command: `nodemon -r tsconfig-paths/register ./src/cronJob.ts`
  - Starts the cron jobs server, running scheduled tasks with `nodemon` and enabling hot-reloading.

- **`build`**:

  - Command: `npx tsc -p tsconfig.build.json && node ./build.js`
  - Builds the TypeScript files using the `tsconfig.build.json` configuration and then runs the build script (`build.js`) to prepare the project for production deployment.

- **`build:start`**:

  - Command: `nodemon ./dist/index.js`
  - Runs the production version of the server from the `dist` folder using `nodemon` to watch for changes.

- **`build:start:cron`**:

  - Command: `nodemon ./dist/cronJob.js`
  - Runs the cron jobs in production mode from the `dist` folder with `nodemon` for automatic reloads.

- **`prettier`**:

  - Command: `prettier --config ./.prettierrc.json --write src/**/*`
  - Runs Prettier to format the source code according to the `.prettierrc.json` configuration file.

- **`test`**:
  - Command: `npx jest`
  - Runs the tests using Jest.

---

## Directory Structure

The project’s directory structure is organized to support a clean separation of concerns and modularity. Here's an overview:

```
├───dist                    # Compiled production code
├───public                  # Publicly accessible assets and build
└───src                     # Main source code for the backend
    ├───api                 # API-related code
    │   ├───controllers     # Controllers that handle requests and business logic
    │   └───routes          # Defines route handlers for API endpoints
    │       ├───tasks       # Task-related routes and controllers
    │       │   └───controllers
    │       │       ├───addTask            # Controller for adding tasks
    │       │       ├───deleteTaskById     # Controller for deleting tasks by ID
    │       │       ├───getTaskById        # Controller for getting a task by ID
    │       │       ├───getTasks           # Controller for getting a list of tasks
    │       │       └───updateTask         # Controller for updating tasks
    │       └───user
    │           ├───controllers
    │           │   ├───changePassword    # Controller for changing user password
    │           │   ├───getDetails        # Controller for fetching user details
    │           │   ├───getNotifications  # Controller for fetching user notifications
    │           │   ├───getNotificationsCount  # Controller for fetching notification count
    │           │   └───markNotificationsRead # Controller for marking notifications as read
    │           └───routes
    │               └───auth
    │                   └───controllers    # Controllers for user authentication routes
    │                       ├───login
    │                       ├───logout
    │                       ├───requestResetPassword
    │                       ├───resendOTP
    │                       ├───resetPassword
    │                       ├───signup
    │                       └───verifyUser
    ├───db                  # Database connection and models
    ├───globals             # Global constants and configurations
    ├───middlewares         # Custom middlewares (e.g., authentication)
    ├───models              # Mongoose models for MongoDB
    │   ├───tasks           # Task model
    │   └───users           # User model
    ├───services            # Service logic (e.g., email services, user management)
    │   ├───email           # Email service for notifications
    │   └───users           # User-related services
    ├───templates           # Templates for email notifications
    │   └───emails          # Email templates for different notifications
    └───utils               # Utility functions and helpers
.env                        # Environment variables (e.g., DB credentials)
.prettierignore             # Prettier ignore file
.prettierrc.json            # Prettier configuration file
build.js                    # Build script for production deployment
jest.config.js              # Jest configuration file
jest.setup.js               # Jest setup file for tests
package-lock.json           # Dependency lock file
package.json                # Project metadata, dependencies, and scripts
tsconfig.build.json         # TypeScript configuration for building the app
tsconfig.json               # TypeScript configuration for development
```

### Key Directories:

- **`src/api/`**:

  - Contains the core API logic, including routes and controllers.
  - **`controllers/`**: Holds business logic for handling requests (e.g., tasks, user authentication).
  - **`routes/`**: Defines API routes and maps them to controllers. Divided into task and user-related routes.

- **`src/db/`**:

  - Contains database connection logic and settings for MongoDB.

- **`src/middlewares/`**:

  - Holds custom middleware functions for handling tasks like authentication or logging.

- **`src/models/`**:

  - Contains the Mongoose models for the `tasks` and `users` collections in MongoDB.

- **`src/services/`**:

  - Contains logic for interacting with external services such as email notifications or user-related services.

- **`src/templates/`**:

  - Stores the email templates used by the email service.

- **`src/utils/`**:
  - Utility functions or helper functions used across the project.

### Other Files:

- **`.env`**:

  - Holds environment-specific variables like database connection credentials or API keys.

- **`.prettierignore`**:

  - Defines files and directories to be ignored by Prettier for code formatting.

- **`.prettierrc.json`**:

  - Configuration file for Prettier to ensure consistent code formatting.

- **`build.js`**:

  - Script for managing the build process when preparing for deployment.

- **`jest.config.js` and `jest.setup.js`**:

  - Configuration and setup files for Jest testing.

- **`package.json`**:

  - Contains metadata, dependencies, and npm scripts for the project.

- **`tsconfig.*.json`**:
  - TypeScript configuration files, with one for development and another for building the project.

---
