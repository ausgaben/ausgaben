# Ausgaben

[![Travis CI](https://travis-ci.org/ausgaben/ausgaben.svg?branch=master)](https://travis-ci.org/ausgaben/ausgaben)

[![Code Climate](https://codeclimate.com/github/ausgaben/ausgaben/badges/gpa.svg)](https://codeclimate.com/github/ausgaben/ausgaben)

## Set up

    # Create database
    sudo su postgres
    psql
    CREATE USER ausgaben;
    ALTER ROLE ausgaben WITH PASSWORD 'password';
    CREATE DATABASE ausgaben;
    GRANT ALL PRIVILEGES ON DATABASE ausgaben TO ausgaben;
    # Init database
    node server/console.js sequelize:schema:sync

