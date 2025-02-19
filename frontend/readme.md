# Task Scheduler Frontend

## Overview

Welcome to the Task Scheduler Frontend repository! This project is designed to provide a user-friendly interface for task scheduling and management. It leverages modern web technologies such as React, TypeScript, Vite, and Axios to deliver a seamless and responsive experience. This project interacts with backend APIs to manage tasks, user authentication, and notifications.

---

## Commands in `package.json`

The `package.json` file contains various scripts to help with the development, build, and deployment of the project. Here's a breakdown of the available commands:

- **`dev`**:

  - Command: `vite`
  - This starts the development server using Vite. You can access the application in the browser and start making changes in real-time.

- **`build`**:

  - Command: `tsc -b && vite build`
  - This command builds the TypeScript project and compiles it for production using Vite. It generates optimized, minified code suitable for deployment.

- **`lint`**:

  - Command: `eslint .`
  - This runs ESLint across the entire project to check for JavaScript/TypeScript coding style issues and potential errors.

- **`preview`**:
  - Command: `vite preview`
  - After building the project, this command allows you to preview the production version locally before deploying.

---

## Directory Structure

Below is an overview of the project's directory structure:

```
├───public
└───src
    ├───apis
    │   ├───tasks
    │   └───user
    │       └───auth
    ├───assets
    │   └───images
    ├───components
    │   ├───common
    │   ├───layout
    │   │   └───NavBar
    │   └───utility
    │       ├───GlobalLoader
    │       ├───Heading
    │       ├───NoDataFound
    │       ├───Paragraph
    │       └───ShowError
    ├───features
    │   └───Notifications
    ├───globals
    ├───hooks
    │   └───user
    ├───pages
    │   ├───auth
    │   │   ├───ForgotPassword
    │   │   ├───Login
    │   │   ├───ResetPassword
    │   │   ├───Signup
    │   │   └───VerifyUser
    │   ├───Profile
    │   └───tasks
    │       ├───AddTask
    │       ├───TaskDetails
    │       └───TaskList
    └───scss
.env
.prettierrc.json
eslint.config.js
index.html
package-lock.json
package.json
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

### Explanation of Key Directories:

- **`public/src/`**:
  The main source code directory for the frontend application.

  - **`apis/`**:
    Contains all API interaction files.
    - `tasks/`: Handles API requests related to task management.
    - `user/`: Handles API requests related to user operations like authentication.
  - **`assets/`**:
    Contains assets like images, icons, or other media files.

  - **`components/`**:
    Contains reusable React components, categorized into:

    - `common/`: Common components that can be used throughout the app.
    - `layout/`: Components related to the page layout, such as the `NavBar`.
    - `utility/`: Utility components such as loaders, headings, error messages, etc.

  - **`features/`**:
    Contains features or sections of the app. In this case, it includes the `Notifications` feature.

  - **`globals/`**:
    Holds global configurations and constants for the app.

  - **`hooks/`**:
    Custom React hooks that are used for managing application logic. For example, `user/` could have hooks for authentication and user state.

  - **`pages/`**:
    This folder contains all the page-level components, organized by feature or type:

    - **`auth/`**: Contains pages related to authentication (Login, Signup, Forgot Password, etc.).
    - **`Profile/`**: Contains the Profile page.
    - **`tasks/`**: Contains pages related to tasks such as Add Task, Task Details, and Task List.

  - **`scss/`**:
    Contains SCSS stylesheets for styling the components and layout of the app.

---

## Other Files

- **`.env`**: Contains environment variables, such as API keys or configuration settings for different environments (development, production).

- **`.prettierrc.json`**: Prettier configuration for consistent code formatting.

- **`eslint.config.js`**: ESLint configuration file for linting JavaScript/TypeScript code.

- **`index.html`**: The root HTML file that contains the entry point for the application.

- **`package-lock.json`**: Automatically generated file to lock the versions of installed dependencies.

- **`package.json`**: Contains the metadata for the project and defines dependencies, scripts, and other configurations.

- **`tsconfig.*.json`**: TypeScript configuration files used for different environments (`app`, `node`, etc.).

- **`vite.config.ts`**: Configuration file for Vite, used to optimize and build the frontend app.

---
