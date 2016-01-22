@After=Registration
Feature: /api/user/:id
    Fetch the user profile

    Background: Client defaults

        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Accept header
        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Content-Type header
        Given "Bearer {token}" is the Authorization header

    Scenario: GET

        When I GET {jwt.sub}
        Then the status code should be 200
        And the Content-Type header should equal "application/vnd.ausgaben.v1+json; charset=utf-8"
        And "$context" should equal "https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#User"
        And "$id" should equal "{jwt.sub}"
        And "email" should equal "mike.doe-{time}@example.com"

    Scenario: GET (account that is not me)

        When I GET /api/user/1234567890
        Then the status code should be 403

