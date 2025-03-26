# Football Ratings Frontend

A modern web application for viewing football team and player ratings.

## Setup

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd apps/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Configuration

The application uses configuration files to manage environment-specific settings.

1. Copy the example configuration file:
   ```bash
   cp src/config/appsettings.example.json src/config/appsettings.json
   ```

2. Edit `src/config/appsettings.json` to customize settings:
   ```json
   {
     "api": {
       "baseUrl": "https://localhost:5001/graphql",
       "timeout": 10000
     },
     "auth": {},
     "features": {
       "enableDarkMode": true,
       "enableNotifications": true
     },
     "defaults": {
       "language": "en",
       "itemsPerPage": 20
     }
   }
   ```

3. Create a `.env` file for environment-specific variables:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file to add your Football API key:
   ```bash
   VITE_FOOTBALL_API_KEY=your_api_key_here
   ```
   You can get an API key by signing up at [API-Football](https://www.api-football.com/).

### Football API Integration

The application integrates with the Football API to fetch real-time data about leagues, teams, fixtures, and more. This integration provides:

- League rounds information
- Match fixtures and results
- Team and player data

To use this feature:

1. Sign up for an API key at [API-Football](https://www.api-football.com/)
2. Add your API key to the `.env` file as described in the Configuration section
3. The application will automatically use the API when available, falling back to mock data if the API is not configured or unavailable

The API integration is implemented in the `api.ts` service file, with functions like:
- `syncFootballApiRounds`: Fetches league rounds
- `syncFootballApiFixtures`: Fetches fixtures for a league and season

### Running the Application

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:9000.

## Features

- View teams and players
- Browse league standings
- View match details and lineups
- Simple email/password authentication
- Customizable user preferences

## Authentication

The application uses a simple email/password authentication system:

- **Login**: Users can log in with their email and password
- **Registration**: New users can register with email, password, and name
- **Protected Routes**: Some routes require authentication to access

For development purposes, the authentication is simulated locally without a backend. In a production environment, you would connect this to a real authentication API.

## Development

### Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components
- `src/layouts`: Layout components
- `src/services`: API and authentication services
- `src/config`: Configuration files
- `src/router`: Routing configuration

### Adding New Features

1. Create new components in the appropriate directories
2. Update the router configuration if adding new pages
3. Update the API service if adding new data endpoints
4. Update the configuration if adding new settings

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Security Considerations

- Never commit `appsettings.json` to version control
- Use environment variables for sensitive information in production
- Implement proper password hashing and validation in a real backend
- Use HTTPS in production
