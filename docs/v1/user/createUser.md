# Create user

Create a user in the backend if you are not already registered

**URL** : `/api/v1/users`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

- Provide firstName, lastName and phone to be created.

```json
{
    "firstName": "[2 to 100 chars]",
    "lastName": "[2 to 100 chars]",
    "phone": "[2 to 50 chars]"
}
```

**Data example** All fields must be sent. Partial data is not allowed.
                                          
```json
{
    "name": "Jose",
    "lastName": "Fernandez",
    "phone": "+34657101112"
}
```

## Success Responses

** Condition** : `Data provided is valid, phone number provided does not match any existing user and phone number fomart is valid`

**Code** : `201 CREATED`

**Content example** : Content example : Response will reflect back the current information. A User with id of '1234' sets their firstName, lastName and phone:


```json
{
    "id": 1234,
    "name": "Jose",
    "lastName": "Fernandez",
    "phone": "+34657101112"
}
```

## Error Responses

**Condition** : If User already exists.

**Code** : `409 CONFLICT`

**Headers** : `Location: http://testserver/api/accounts/123/`

**Content example** : 

```json
{
    "statusCode": 409,
    "message": "User +34657101112 already exists",
    "error": "user_already_exits"
}
```


### Or

**Condition** : If fields are missed.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "statusCode": 400,
    "error": "invalid_request_data",
    "message": "There are one or more errors in the input request data",
    "fixList": {
        "firstName": [
            "firstName must be a string",
            "firstName must be shorter than or equal to 100 characters",
            "firstName must be longer than or equal to 2 characters"
        ],
        "lastName": [
            "lastName must be a string",
            "lastName must be shorter than or equal to 100 characters",
            "lastName must be longer than or equal to 2 characters"
        ],
        "phone": [
            "phone must be a string",
            "phone must be shorter than or equal to 50 characters",
            "phone must be longer than or equal to 2 characters"
        ]
    }
}
```

### Or

**Condition** : If phone is invalid.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "statusCode": 400,
    "error": "invalid_phone_number",
    "message": "the phone number is not in a valid format"
}
```

### Or

**Condition** : If phone number verification platform is not available

**Code** : `503 BAD REQUEST`

**Content example**

```json
{
    "statusCode": 503,
    "error": "external_phone_verification_error",
    "message": "Phone verification operation could not be completed. Please try again later or contact support"
}
```