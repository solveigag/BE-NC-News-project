# News App API Repository


## About the Project


This app is designed to demonstrate interaction with PSQL database by publishing and retrieving data.

To view the hosted version and a list of supported endpoints, please visit:

https://solveiga-nc-news-be.herokuapp.com/api

---

## Setting-Up


### 1. Cloning the Repository


To clone this repository to your machine use the following command:


    git clone https://github.com/solveigag/BE-NC-News-project.git


### 2. Installing Dependencies


To install the necessary dependencies use the following command:

     npm i


### 3. Setting-Up Necessary Environment Variables


Create two `.env` files: `.env.test` and `.env.development`. Add `PGDATABASE=<database_name_here>` to both files with the relevant database name for that environment (database names are located in `/db/setup.sql` file).

### 4. Seeding the Database


To set-up the database and seed it use the following commands:

     npm run setup-dbs

     npm run seed

---

## Testing


Tests are located in the **__tests__** folder and have been separated to asses the app and utility functions separately.

To run the app tests use the following command:

     npm test app

To run the util tests use the following command:

     npm test util

To run all tests use the command:

    npm test

---

## Minimum Versions


Node 18.5.0

PostgreSQL 14.4