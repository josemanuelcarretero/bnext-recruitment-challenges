# Get contacts

Get all contacts of a registered user in the backend

**URL** : `/api/v1/users/:id/contacts`

**URL Parameters** : id=[integer] where id is the ID of the User on the server.

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Code** : `200 OK`

**Content** : In this example we can see 3 contacts with 3 different phone numbers

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