# Ausgaben

[![Build Status](https://travis-ci.org/ausgaben/ausgaben-node.svg?branch=master)](https://travis-ci.org/ausgaben/ausgaben-node) [![Codacy Badge](https://api.codacy.com/project/badge/coverage/a87671c482ce4e8283aa901447a6001c)](https://www.codacy.com/app/m_7/ausgaben-node) [![Code Climate](https://codeclimate.com/github/ausgaben/ausgaben-node/badges/gpa.svg)](https://codeclimate.com/github/ausgaben/ausgaben-node) [![Dependency Status](https://www.versioneye.com/user/projects/568e51f6691e2d003d000001/badge.svg?style=flat)](https://www.versioneye.com/user/projects/568e51f6691e2d003d000001) [![Codacy Badge](https://api.codacy.com/project/badge/grade/a87671c482ce4e8283aa901447a6001c)](https://www.codacy.com/app/m_7/ausgaben-node)

## Set up

    # Install dependencies
    npm install
    # Create database
    sudo su postgres
    createdb ausgaben
    psql
    CREATE USER ausgaben;
    ALTER ROLE ausgaben WITH PASSWORD 'password';
    CREATE DATABASE ausgaben;
    GRANT ALL PRIVILEGES ON DATABASE ausgaben TO ausgaben;
    # Init database
    node server/console.js sequelize:schema:sync
    # To reset the database
    sudo -u postgres /bin/bash -c 'dropdb ausgaben; createdb ausgaben' && node server/console.js sequelize:schema:sync
    
## Run tests

    npm test
    
## Run the app

    make
    npm run dev-server
    
