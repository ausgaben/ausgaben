Feature: /api/status

    Background: Client defaults

        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Accept header
        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Content-Type header

    Scenario: GET

        When I GET /api/status
        Then the status code should be 200
        And the Content-Type header should equal "application/vnd.ausgaben.v1+json; charset=utf-8"
        And "status" should equal "ok"
