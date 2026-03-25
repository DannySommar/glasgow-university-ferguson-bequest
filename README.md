# SH40 Main Ferguson Bequest

## Description
This project was part of the Level 3 Team Project course to develop a piece of software for use by the customer. 
Ferguson Bequest is a system that brings together available attractions, ticket draws and booking information in one place. It exists to help University of Glasgow staff access and enjoy various activities. 
The aim of this project was to redesign the website for better usability and ease of use for administrators.

### Features
- Simple, modern interface
- Attraction booking
- Ticket draw entering
- Booking history
- Announcements
- Reviews for attractions

### Additional Features for Admins
- Add and delete attractions and ticket draws
- Pick a winner from a ticket draw
- Edit attractions/ticket draws
- Post and delete announcements


## Requirements
You must have Docker installed on your desktop, or at the very least, the Docker daemon. Go to [Docker](https://www.docker.com/) and click on Download Docker Desktop. Choose the download for your operating system.

To inspect the code, you must have an Integrated Development Environment (IDE). We would suggest using Visual Studio Code which can be downloaded [here](https://code.visualstudio.com/).

## Installation
- Clone this project
  ```
  git clone https://github.com/DannySommar/glasgow-university-ferguson-bequest.git
  ```
- Navigate to the project directory
  ```
  cd glasgow-university-ferguson-bequest
  ```
- Copy the environment template
  ```
  cp .env.example .env
  ```
- Edit `.env` with your configuration (see Configuration section below)
- Build and run with Docker
  ```
  docker compose up --build
  ```
- The application will be available at your specified domain, which cam be set in the `.env` file.

## Configuration

The application uses a `.env` file for configuration. Copy `.env.example` to `.env` and modify as needed:

| Variable | Description | During Development |
|----------|-------------|---------|
| **Frontend** | | |
| `FRONTEND_PORT` | External port for the web interface | `5000` |
| `SERVER_NAME` | Server name for nginx | `_` |
| `BACKEND_URL` | URL where the backend API is reachable | `http://backend:8000` |
| `GATEWAY_URL` | SSO gateway URL for authentication | `https://studentproject-gateway.dcs.gla.ac.uk/psd` |
| **Backend** | | |
| `BACKEND_PORT` | Internal port for backend API | `8000` |
| `DB_HOST` | PostgreSQL host | `db` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `sh40db` |
| `DB_USER` | Database username | `sh40user` |
| `DB_PASSWORD` | Database password | `sh40password` |
| `SESSION_SECRET` | Secret key for session encryption | `skibidi` |
| `COOKIE_DOMAIN` | Domain for session cookie | `maloelap.dcs.gla.ac.uk` |
| `COOKIE_SECURE` | Set to `true` if using HTTPS | `false` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `FRONTEND_URL` | Public URL of the frontend | `http://maloelap.dcs.gla.ac.uk:5000` |
| **SSO Headers** (provided by University gateway) | | |
| `SSO_HEADER_GUID` | HTTP header containing user GUID | `dh75hdyt76` |
| `SSO_HEADER_NAME` | HTTP header containing user name | `dh75hdyt77` |
| `SSO_HEADER_EMAIL` | HTTP header containing user email | `dh75hdyt80` |
| **Admin** | | |
| `ADMIN_EMAILS` | Comma-separated list of admin email addresses | See `.env.example` |
| **Database** | | |
| `POSTGRES_DB` | PostgreSQL database name | `sh40db` |
| `POSTGRES_USER` | PostgreSQL username | `sh40user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `sh40password` |

### Production Deployment Notes
- Set `FRONTEND_PORT=80` for direct HTTP access
- Set `COOKIE_SECURE=true` if using HTTPS
- Configure `GATEWAY_URL` to your production SSO gateway

## Viewing the current website on the University network
Visit `http://maloelap.dcs.gla.ac.uk:5000/` when connected to the University network or using the University VPN.

## Project Structure
**Frontend** (React/Vite):
- `pages/` - Each web page component
- `components/` - Reusable UI elements (Navbar, Footer, AttractionCard ...)
- `images/` - Static images used in the application
- `contexts/` - React context providers (AuthContext)
- `utils/` - Helper functions
- `tests/` - Test files

**Backend** (Express/PostgreSQL):
- `database/` - Database schema and seeding scripts
- `controllers/` - Request handlers
- `routes/` - API routes that forward to `controllers/`
- `middleware/` - Authentication and upload handling
- `uploads/` - User-uploaded images (persisted via Docker volume)
- `tests/` - Test files

To run tests:
```npm run test``` doesn't work lol test driven development is a myth i cant take it oi cant take it oi cant take it i cant take it i cnat take it i cant take it i cant take it i cant take it

```
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Manual Deployment Notes

### Docker Deployment (Recommended)
The project is designed to run with Docker Compose. All paths and configurations are set for containerized deployment.

### More Manual Deployment (Not Recommended)
If deploying without Docker, the following adjustments are to be made at the very least:

| Component | Docker Path | Manual Alternative |
|-----------|-------------|-------------------|
| Backend uploads | `/app/uploads` | Change to absolute path in `server.js` (like `./backend/uploads`) |
| Frontend static files | `/usr/share/nginx/html` | lol idk |
| Backend port | `8000` | Configurable via `BACKEND_PORT` in `.env` |
| Frontend port | `5000` | Configurable via `FRONTEND_PORT` in `.env` |
| Database host | `db` (Docker service name) | Change to `localhost` or actual database host in `.env` |

**Important**: The uploads path in `server.js` is hardcoded to `/app/uploads`. For non-Docker deployment, you must change:
```
const uploadsPath = '/app/uploads';
// To a path that exists on your system:
const uploadsPath = path.join(__dirname, '../uploads');
```


## Support
If you need help, please contact one of the authors of this project:
- **Danny Shevchuk 2913985S@student.gla.ac.uk**
- **Lewis Gray 2887454G@student.gla.ac.uk**
- **Diana Polese-Abramowicz 2881748P@student.gla.ac.uk**
- **Hammaad Uddin 2787006U@student.gla.ac.uk**
- **Andrea Alexander 2892128A@student.gla.ac.uk**


## Authors and acknowledgment
- Andrea Alexander
- Danny Shevchuk
- Diana Polese-Abramowicz
- Hammaad Uddin
- Lewis Gray

We want to thank the Ferguson Bequest team and the University of Glasgow for allowing us to partake in this project.

## License
This project is licensed under the [MIT License.](https://opensource.org/license/MIT) You can find the project license [here](https://stgit.dcs.gla.ac.uk./team-project-h/2025/sh40/sh40-main/-/blob/main/LICENSE)