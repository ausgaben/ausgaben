Feature: Registration

    Background: Client defaults

        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Accept header
        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Content-Type header

    Scenario: create

        Given this is the request body
        --------------
        {
            "email": "john.doe@example.com"
        }
        --------------
        When I POST to /api/registration
        Then the status code should be 201
        And the Content-Type header should equal "application/vnd.ausgaben.v1+json; charset=utf-8"
        And "$context" should equal "https://tools.ietf.org/html/rfc7519"
        And "token" should exist
        And I store "token" as "token"
