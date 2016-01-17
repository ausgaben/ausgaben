@After=Registration
Feature: /api/login

    Background: Client defaults

        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Accept header
        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Content-Type header

    Scenario: POST (request login link)

        Given this is the request body
        --------------
        "email": "mike.doe-{time}@example.com"
        --------------
        When I POST to /api/login
        Then the status code should be 202
