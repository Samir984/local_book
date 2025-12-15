# LocalBook

A platform that enables the reuse of old books, fostering a community of sustainable reading.

## 🚀 About

LocalBook is a web application designed to help users buy, sell, or exchange used books within their local community. By connecting readers, we aim to extend the lifecycle of books and reduce waste.

## 🛠 Tech Stack

### Backend

- **Framework**: [Django 5.2](https://www.djangoproject.com/)
- **API**: [Django Ninja](https://django-ninja.rest-framework.com/)
- **Database**: PostgreSQL with PostGIS extension (Spatial data support)
- **Storage**: AWS S3
- **Authentication**: JWT
- **Other**: `whitenoise-spa` for serving static files, `pydantic` for validation.

### Frontend

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Component Librarys**: [Chadcn Ui](https://ui.shadcn.com/)
- **State Management & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Forms**: React Hook Form + Zod
- **API Client**: Axios (with [Kubb](https://kubb.dev/) for OpenAPI code generation)
- **Icons**: Lucide React

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Server**: Gunicorn (Production)

## 📂 Project Structure

```bash
local_book/
├── backend/            # Django backend application
├── frontend/           # React frontend application
├── docker-compose.yml  # Docker services configuration
├── requirements.txt    # Python dependencies
└── README.md           # Project documentation
```


## ✨ Features

- **User Authentication**: Secure login and registration.
- **Book Listing**: detailed management of books available for reuse.
- **Geo-Location**: Find books near you (powered by PostGIS).
- **Book Management**: Allow the management of books list and status.
