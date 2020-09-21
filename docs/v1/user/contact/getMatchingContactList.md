# Get matching contacts
Get all matching contacts between two registered users in the backend

**URL** : `/api/v1/users/:id1,:id2/contacts`

**URL Parameters** : 
- id1=[integer] where id is the ID of the User on the server.
- id2=[integer] where id is the ID of the User on the server.

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Code** : `200 OK`

**Content** : In this example we can see 2 contacts with 2 different phone numbers

```json
[
    {
        "phone": "+34657151617",
        "contactName": "Manuel Lorca"
    },
    {
        "phone": "+34657151618",
        "contactName": "Juan Ferrer"
    }
]
```
## Error Responses

**Condition** : If User does not exist with `id1` parameter and/or`id2` parameter.

**Code** : `404 NOT FOUND`

**Content example**
```json
{
    "statusCode": 400,
    "message": "User 7 not found",
    "error": "user_not_found"
}
```

## Or

**Condition** : If `id1` parameter and/or `id2 parameter format are not valid.

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