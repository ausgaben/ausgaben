Feature: Registration

    Background: Client defaults

        Given "application/vnd.ausgaben.v1+json" is the Accept header

    Scenario: create

        Given this is the request body
        --------------
        {
            "email": "john.doe@example.com"
        }
        --------------
        When I POST to /api/registration
        Then the status code should be 201
        And the Content-Type header should contain "application/vnd.ausgaben.v1+json"
        And "$context" should equal "https://tools.ietf.org/html/rfc7519"
        And "$id" should exist
        And "token" should exist
