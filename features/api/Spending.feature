@After=Account
Feature: /api/:account/spending

    Background: Client defaults

        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Accept header
        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Content-Type header
        Given "Bearer {token}" is the Authorization header

    Scenario: POST (create)

        Given this is the request body
        --------------
        "type": "[type]",
        "category": "[category]",
        "title": "[title]",
        "amount": [amount],
        "booked": [booked],
        "bookedAt": "[bookedAt]"
        --------------
        When I POST to {account}/spending
        Then the status code should be 201
        And the Location header should exist
        When I follow the redirect
        Then the status code should be 200
        And the Content-Type header should equal "application/vnd.ausgaben.v1+json; charset=utf-8"
        And "$context" should equal "https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Spending"
        And "$id" should exist
        And "type" should equal "[type]"
        And "category" should equal "[category]"
        And "title" should equal "[title]"
        And "amount" should equal [amount]
        And "booked" should equal [booked]
        And "bookedAt" should equal "[bookedAt]"

    Where:

    -------------------------------------------------------------------------------------
    | type     | category | title          | amount | booked | bookedAt                 |
    | spending | Pets     | Cat food       | -12345 | true   | 2015-01-02T00:00:00.000Z |
    | spending | Pets     | Dog food       | -5678  | true   | 2015-01-03T00:00:00.000Z |
    -------------------------------------------------------------------------------------

    Scenario: GET (list spendings)

        When I GET {account}/spending
        Then the status code should be 200
        And the Content-Type header should equal "application/vnd.ausgaben.v1+json; charset=utf-8"
        And a list of "https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Spending" with 2 of 2 items should be returned
