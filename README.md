# Ausgaben

[![Build Status](https://travis-ci.org/ausgaben/ausgaben-node.svg?branch=master)](https://travis-ci.org/ausgaben/ausgaben-node) [![Code Climate](https://codeclimate.com/github/ausgaben/ausgaben-node/badges/gpa.svg)](https://codeclimate.com/github/ausgaben/ausgaben-node) [![Dependency Status](https://www.versioneye.com/user/projects/568e51f6691e2d003d000001/badge.svg?style=flat)](https://www.versioneye.com/user/projects/568e51f6691e2d003d000001)

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

## Run tests

    npm test
    
## Run the app

    npm start
