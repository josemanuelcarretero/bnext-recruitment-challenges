# Update contact list

Completely updates the registered user's contact list. Existing contacts that are not in this list will be deleted, the remaining contacts will be created or updated

**URL** : `/api/v1/users/:id/contacts`

**Method** : `PUT`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

- Provide a list of object with contactName and phone fields to be updated.

```json
[
    {
        "contactName": "[2 to 100 chars]",
        "phone": "[2 to 50 chars]"
    }
]
```

**Data example** All fields must be sent. Partial data is not allowed.
                                          
```json
[
    {
        "phone": "+34657151617",
        "contactName": "Manuel Lorca"
    },
    {
        "phone": "+34657151618",
        "contactName": "Juan Ferrer"
    },
    {
        "phone": "+34657151619",
        "contactName": "Alberto Jimenez"
    }
]
```

## Success Responses

** Condition** : `Data provided is valid and phone number provided does not match any existing contact from that user`

**Code** : `204 NO CONTENT`

**Content example** : ``

## Error Responses

**Condition** : If User does not exist with  a `id` parameter.

**Code** : `404 NOT FOUND`

**Content example**
```json
{
    "statusCode": 400,
    "message": "User 9 not found",
    "error": "user_not_found"
}
```

## Or

**Condition** : If `id` parameter format is not valid.

**Code** : `404 NOT FOUND`

**Content example**

```json
{
    "statusCode": 400,
    "error": "invalid_url_parameter",
    "message": "There are one or more errors in the url parameters",
    "fixList": {
        "id": [
            "id is not a numeric string"
        ]
    }
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
        "contactName": [
            "firstName must be a string",
            "firstName must be shorter than or equal to 100 characters",
            "firstName must be longer than or equal to 2 characters"
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