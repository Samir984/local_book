FROM python:3.11-alpine
RUN apk update && \
    apk add --no-cache \
        # General build dependencies
        build-base \
        # Python development headers
        python3-dev \
        # GDAL and its development headers
        gdal \
        gdal-dev \
        # GEOS and its development headers
        geos \
        geos-dev \
        # PROJ and its development headers
        proj \
        proj-dev \
        # PostgreSQL client development headers for psycopg2
        postgresql-dev \
    && rm -rf /var/cache/apk/* # Clean up apk cache to reduce image size
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["/bin/sh", "-c", "python manage.py collectstatic --noinput;python manage.py migrate;gunicorn --bind 0.0.0.0:8000 --workers=1 --env DJANGO_SETTINGS_MODULE=project.settings project.wsgi"]
