# Get all users

Get a registered user details in the backend

**URL** : `/api/v1/users/:id`

**URL Parameters** : id=[integer] where id is the ID of the User on the server.

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

## Success Response

**Condition** : If User exists.

**Code** : `200 OK`

**Content example**

```json
{ 
    "id": 1,
    "name":"Joaquin",
    "lastName":"Espinosa",
    "phone": "+34657151617"
}
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
