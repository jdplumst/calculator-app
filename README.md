# Project Description

This is a calculator app with user authentication. This link to the deployed app is https://calculator-app-olive.vercel.app/. The login page is https://calculator-app-olive.vercel.app/login and the signup page is https://calculator-app-olive.vercel.app/signup.

The history function is located to the right of the calculator screen. The top button is used to start displaying history, and the up and down arrow buttons are used to navigate through the user's history, but only after the top button is pressed first.

This app was deployed using Vercel and the PostgreSQL database is hosted by Supabase.

In case using database hosting with Supabase is not allowed, this app can also be run locally by following the instructions below.

## How to Run Locally

1. Clone this repository

   ```
   git clone https://github.com/jdplumst/calculator-app.git
   ```

2. Install NPM packages

   ```
   cd calculator-app
   npm install
   ```

3. Go to https://www.postgresql.org/download/ and install PostgreSQL on your machine.

4. Open the command prompt and login, entering password when prompted

   ```
   psql -U [USERNAME]
   ```

5. Create a database called calculator

   ```
   CREATE DATABASE calculator;
   ```

6. Connect to the database and get the connection info

   ```
   \c calculator
   \conninfo
   ```

7. Go into the code files and create a .env file and enter the database URL
   ```
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/calculator
   ```
8. Push the db schema
   ```
   npx prisma db push
   npx prisma generate
   ```
9. Run the app

   ```
   npm run dev
   ```

10. Open the app by entering localhost:3000 into your browser
