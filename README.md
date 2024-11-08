# Vite + React Project

This project is built with Vite and React. Below are the instructions to set up and run the project in a development environment.

## Prerequisites

Ensure you have the following tools installed:

- **Node.js** (version 14 or higher): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

To verify the installation, run the following commands in your terminal:

```bash
node -v
```
## Install dependencies

```bash
npm install
```
## Runing in development

To simulate the server, create a file called `.env` and add the following values:

```
VITE_ENVIRONMENT=local
VITE_PROD_API=https://api.prod.example.com
VITE_LOCAL_API=http://localhost:8000
```
Then, start the local server by running:
```bash
npm run dev
```