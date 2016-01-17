@After=Registration
Feature: /api/token/verify
    Verify the token

    Background: Client defaults

        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Accept header
        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Content-Type header
        Given "Bearer {token}" is the Authorization header

    Scenario: POST (create)

        When I POST to /api/token/verify
        Then the status code should be 204
