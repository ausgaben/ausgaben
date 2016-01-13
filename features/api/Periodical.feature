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
        And "type" should equal "[type]"
        And "category" should equal "[category]"
        And "title" should equal "[title]"
        And "amount" should equal [amount]
        And "starts" should equal "[starts]"
        And "estimate" should equal false
        And "enabledIn01" should equal true
        And "enabledIn02" should equal true
        And "enabledIn03" should equal true
        And "enabledIn04" should equal true
        And "enabledIn05" should equal true
        And "enabledIn06" should equal true
        And "enabledIn07" should equal true
        And "enabledIn08" should equal true
        And "enabledIn09" should equal true
        And "enabledIn10" should equal true
        And "enabledIn11" should equal true
        And "enabledIn12" should equal true

    Where:

    ----------------------------------------------------------------------------
    | type     | category | title          | amount | starts                   |
    | income   | Salary   | Tanja's Salary | 165432 | 2015-01-01T00:00:00.000Z |
    | income   | Salary   | Markus' Salary | 123456 | 2015-01-02T00:00:00.000Z |
    | spending | Pets     | Cat food       | -12345 | 2015-01-03T00:00:00.000Z |
    | spending | Pets     | Dog food       | -23456 | 2015-01-04T00:00:00.000Z |
    ----------------------------------------------------------------------------

    Scenario: GET (list periodicals)

        When I GET {account}/periodical
        Then the status code should be 200
        And the Content-Type header should equal "application/vnd.ausgaben.v1+json; charset=utf-8"
        And a list of "https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Periodical" with 4 of 4 items should be returned
