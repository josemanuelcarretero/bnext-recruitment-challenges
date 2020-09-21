# Get all users

Get details of all registered users in the backend

**URL** : `/api/v1/users`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Code** : `200 OK`

**Content** : In this example we can see 3 users with 3 different phone numbers

```json
[
    {
      "id": 1,
      "name":"Jose",
      "lastName":"Fernandez",
      "phone": "+34657101112"
    },
    { 
      "id": 2,
      "name":"Manuel",
      "lastName":"Garcia",
      "phone": "+34657121314"
    },
    { 
      "id": 3,
      "name":"Joaquin",
      "lastName":"Espinosa",
      "phone": "+34657151617"
    }
]
```