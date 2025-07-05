# LoginApp

A simple login application with separate backend and frontend components.

## Project Structure

```
LoginApp/
├── backend-app/
│   ├── auth.controller.js
│   ├── auth.routing.js
│   ├── connect.database.js
│   ├── mailtrap-app/
│   │   ├── config.js
│   │   ├── emailController.js
│   │   └── emailTemplates.js
│   └── user-model-app/
│       └── user.model.js
├── frontend-app/
│   └── src/
│       ├── index.mjs
│       └── test.js
├── utils-app/
│   └── token.js
└── package.json
```

## Getting Started

### Backend
1. Navigate to `backend-app` and install dependencies:
   ```sh
   cd backend-app
   npm install
   ```
2. Configure your database and Mailtrap credentials in the respective config files.
3. Start the backend server:
   ```sh
   npm start
   ```

### Frontend
1. Navigate to `frontend-app/src` and install dependencies (if any):
   ```sh
   cd frontend-app/src
   npm install
   ```
2. Start the frontend (adjust command as needed):
   ```sh
   npm start
   ```

## Features
- User authentication (login/logout)
- Email notifications (Mailtrap integration)
- Token-based authentication
- Modular code structure

### Hiding API Keys
- Store sensitive keys in a `.env` file (never commit this file).
- Add `.env` to your `.gitignore`.
- Access keys in your code using `process.env.YOUR_KEY` (Node.js).

### Running ESLint on Push/PR
- ESLint runs automatically on push and pull request via GitHub Actions (see `.github/workflows/eslint.yml`).
- To run ESLint locally: `npx eslint . --ext .js,.jsx,.ts,.tsx`

### Recommended CI Jobs After Push
- **Linting:** Ensures code style and syntax.
- **Testing:** (Add if you have tests)
- **Build:** (Add if your app requires a build step)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
