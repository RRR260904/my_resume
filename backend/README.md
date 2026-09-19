# Django REST Framework + MongoDB Backend for Developer Portfolio

This backend is built with **Python 3.10+**, **Django 4.2+**, **Django REST Framework (DRF)**, and **PyMongo** connecting to **MongoDB Atlas**.

## Tech Stack
* Python 3.10+
* Django & Django REST Framework
* PyMongo (MongoDB Atlas client)
* SimpleJWT for token authentication
* Gunicorn (production WSGI server)

## Local Setup

1. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables in `.env`:
   ```env
   DJANGO_SECRET_KEY="your-secret-key"
   DEBUG=True
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio_db?retryWrites=true&w=majority"
   MONGODB_DB_NAME="portfolio_db"
   JWT_SECRET="your-jwt-secret-key"
   ```

4. Run migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver 8000
   ```

## Deploying to Render / Railway

### Render:
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository and set the root directory to `backend`.
3. Set **Environment**: `Python 3`.
4. Set **Build Command**: `pip install -r requirements.txt`.
5. Set **Start Command**: `gunicorn portfolio_backend.wsgi:application`.
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas URI
   - `MONGODB_DB_NAME`: `portfolio_db`
   - `DJANGO_SECRET_KEY`: Random 50-character string
   - `JWT_SECRET`: Random 32-character string

### Railway:
1. Deploy from GitHub repository.
2. Set root directory to `backend`.
3. Railway automatically detects `requirements.txt` and runs `gunicorn portfolio_backend.wsgi:application`.
4. Add environment variables in the Railway dashboard.
