@After=Account
Feature: /api/:account/periodical

    Background: Client defaults

        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Accept header
        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Content-Type header
        Given "Bearer: {token}" is the Authentication header

    Scenario: POST (create)

        Given this is the request body
        --------------
        {
            "type": "[type]",
            "category": "[category]",
            "title": "[title]",
            "amount": [amount],
            "starts": "[starts]"
        }
        --------------
        When I POST to {account}/periodical
        Then the status code should be 201
        And the Location header should exist
        When I follow the redirect
        Then the status code should be 200
        And the Content-Type header should equal "application/vnd.ausgaben.v1+json; charset=utf-8"
        And "$context" should equal "https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Periodical"
        And "$id" should exist
        And "name" should equal "Account"

    Where:

        --------------------------------------------------------------
        | type     | category | title          | amount | starts     |
        | income   | Salary   | Tanja's Salary | 165432 | 2015-01-01 |
        | income   | Salary   | Markus' Salary | 123456 | 2015-01-02 |
        | spending | Pets     | Cat food       | -12345 | 2015-01-03 |
        | spending | Pets     | Dog food       | -23456 | 2015-01-04 |
        --------------------------------------------------------------
