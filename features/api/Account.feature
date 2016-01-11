@After=Registration
Feature: Account

    Background: Client defaults

        Given "application/vnd.ausgaben.v1+json" is the Accept header

    Scenario: create

        Given this is the request body
        --------------
        {
            "name": "Account"
        }
        --------------
        When I POST to /api/account
        Then the status code should be 201
        And the Content-Type header should contain "application/vnd.ausgaben.v1+json"
        And "$context" should equal "https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#account"
        And "$id" should exist
        And "name" should equal "Account"
