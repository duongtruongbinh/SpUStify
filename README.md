# SpUStify
# Guide to Running the Source Code

This guide provides step-by-step instructions for teachers on how to set up and run the source code of the project. Please follow these instructions carefully to ensure a smooth setup process.

## Prerequisites

Before you begin, make sure you have the following packages installed on your system:

- django
- django-cors-headers
- psycopg2
- djangorestframework
- Pillow
- django-rest-knox

If you haven't already installed these packages, you can use pip to install them:

```bash
pip install django django-cors-headers psycopg2 django-rest-knox djangorestframework Pillow knox
```

## Getting Started


1. Navigate to the project directory:
```bash
cd ./src/SpUStify/
```

2. Activate the virtual environment (if available):

## Backend Setup
To set up the back-end of the project, you will need to have PostgreSQL installed and running on your system. If you don't have PostgreSQL installed, you can download and install it from PostgreSQL Official Website.

1. Create a database named "SPUSTIFY" in PostgreSQL.

Open the settings.py file in the SpUStify directory and change the database settings to match your PostgreSQL database settings (database name, username, password, etc.)

2. Navigate to the backend directory:
```bash
cd ./src/SpUStify/
```


3. Run the following command to create the database migrations:
```bash
python manage.py makemigrations
```

4. Run the following command to create the database tables:
```bash
python manage.py migrate
```
5. Run the following command to create a superuser:
```bash
python manage.py createsuperuser
```
6. Run the following command to start the back-end server:
```bash
python manage.py runserver
```
This command will launch the back-end server and make your project accessible through a web browser.

## Frontend Setup
To set up the front-end of the project, you will need Node.js installed:
1. Install Node.js:
If you don't have Node.js installed, you can download and install it from Node.js Official Website.
2. Navigate to the frontend directory:
```bash
cd ./src/FE/FEspUStify/
```
3. Install the required dependencies
```bash
npm install
```
4. Run the front-end server
```bash
npm run dev
```
This command will launch the front-end server and make your project accessible through a web browser.
