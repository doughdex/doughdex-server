# DoughDex API Documentation

DoughDex is a web application that enables pizza enthusiasts to explore, track, and review & rate pizza places.

# REST Endpoints

## Users

### `GET /api/users`

Retrieves a list of users. Should not return users with “is_private” or “is_banned” set to true.

### Query Parameters

| Name | Data Type | Required/Optional | Description |
| --- | --- | --- | --- |
| page | Integer | Optional | Page of results to be returned. |
| limit | Integer | Optional | Maximum number of returned records. |

### Example Request:

```jsx
GET /api/users?page=1&limit=10
```

### Response Codes

| Code | Description |
| --- | --- |
| 200 | Successful operation |

### Response payload

```json
{
  "page": 1,
  "limit": 10,
  "total_count": 100,
  "total_pages": 10,
	"links": {
		"first": "/api/users?page=1&limit=10",
		"last": "/api/users?page=10&limit=10",
		"prev": null,
		"next": "/api/users?page=2&limit=10"
	},
  "data": [
    {
      "id": 1,
      "name": "John Doe",
			"display_name": "John",
      "email": "john@example.com",
			"location": "San Francisco",
			"bio": "pizza",
      "avatar_url": "https://example.com/avatar/john.jpg"
    },
    {
      "id": 2,
      "name": "Jane Smith",
			"display_name": "Jane",
      "email": "jane@example.com",
			"location": "San Francisco",
			"bio": "pizza, too",
      "avatar_url": "https://example.com/avatar/jane.jpg"
    },
    // ...
  ]
}
```

### `GET /api/users/:user_id`

Gets detailed information for a given user. Should not return if “is_private” or “is_banned” is set to true.

### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 | Successful operation |
| 404 | Not found |

### Response Payload

```json
{
  "id": 1,
  "name": "John Doe",
	"display_name": "John",
  "email": "john@example.com",
	"location": "San Francisco",
	"bio": "pizza",
  "avatar_url": "https://example.com/avatar/john.jpg"
}
```

### `POST /api/users/`

Creates a new user.

### Request Body

```json
{
  "name": "John Doe",
  "display_name": "johndoe123",
  "email": "john.doe@example.com",
	"timezone": "America/New_York",
  "uid": 123123123123
}
```

### Example Request

```json
POST /api/users HTTP/1.1
Content-Type: application/json

{
  "name": "John Doe",
  "display_name": "johndoe123",
  "email": "john.doe@example.com",
	"timezone": "America/New_York",
	"uid": 123123123123
}
```

### Response Codes

| HTTP Code | Description |
| --- | --- |
| 201 | Successful operation |
| 400 | One or more fields are missing or invalid |

### Response Payload

```json
{
  "id": 1,
  "name": "John Doe",
  "display_name": "johndoe123",
  "email": "john.doe@example.com",
	"timezone": "America/New_York",
	"bio": "",
	"location": "",
	"avatar_url": "",
	"is_admin": false
}
```

### `PUT /api/users/:user_id`

Update user record.

### Authentication

Authentication is required in the form of `Authorization: Bearer <access_token>`.

### User Privileges

The request should be made on behalf of the current user or by a user with admin privileges.

### Request Body

```json
{
  "name": "Updated Name"
}
```

### Example Request

```json
POST /api/users HTTP/1.1
Content-Type: application/json
Authentication: Bearer <access_token>

{
  "name": "Updated Name"
}
```

### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 | Operation Successful |
| 403 | Invalid user ID provided / Inadequate user privileges  |

### Response Payload

```json
{
  "id": 1,
  "name": "Updated Name",
	"display_name": "John",
  "email": "john@example.com",
	"location": "San Francisco",
	"bio": "pizza",
  "avatar_url": "https://example.com/avatar/john.jpg"
}
```

### `DELETE /api/users/:user_id`

Deletes a user record.

### Authentication

Authentication is required in the form of `Authorization: Bearer <access_token>`.

### User Privileges

The request should be made on behalf of the current user or by a user with admin privileges.

### Example Request

```json
DELETE /api/users/:user_id HTTP/1.1
Authentication: Bearer <access_token>
```

### Response Codes

| HTTP Code | Description |
| --- | --- |
| 204 | Successful operation  |

### `GET /api/users/:user_id/lists`

Retrieves a list of users’ curate lists and the places within the lists.

### Query Parameters

| Name | Data Type | Required/Optional | Description |
| --- | --- | --- | --- |
| page | Integer | Optional | Page of results to be returned. Defaults to 1. |
| limit | Integer | Optional | Maximum number of returned records. Defaults to 5. |

### Example Request:

```jsx
GET /api/users/:user_id/lists?page=1&limit=10
```

### Response Codes

| Code | Description |
| --- | --- |
| 200 | Successful operation |

### Response Payload

```json
{
  "user_id": 123,
  "page": 1,
  "limit": 10,
  "total_lists": 3,
  "lists": [
    {
      "list_id": 1,
      "name": "My Favorite Pizza Places",
      "is_ordered": true,
      "is_private": false,
      "is_flagged": false,
      "is_visible": true,
      "created_at": "2023-01-15T14:30:00Z",
      "places": [
        {
          "place_id": 101,
          "name": "Pizza Joint 1",
          "address": "123 Main St",
          "loc": {
            "latitude": 40.12345,
            "longitude": -73.98765
          },
          "recommendations": 5,
          "ratings_counts": {
            "1": 2,
            "2": 1,
            "3": 0,
            "4": 3,
            "5": 12
          }
        },
        {
          "place_id": 102,
          "name": "Pizza Joint 2",
          "address": "456 Elm St",
          "loc": {
            "latitude": 40.54321,
            "longitude": -74.321
          },
          "recommendations": 3,
          "ratings_counts": {
            "1": 1,
            "2": 0,
            "3": 0,
            "4": 2,
            "5": 10
          }
        }
      ]
    },
    {
      "list_id": 2,
      "name": "Pizza Places to Try",
      "is_ordered": false,
      "is_private": true,
      "is_flagged": false,
      "is_visible": true,
      "created_at": "2023-02-10T09:15:00Z",
      "places": [
        {
          "place_id": 103,
          "name": "Pizza Joint 3",
          "address": "789 Oak St",
          "loc": {
            "latitude": 40.98765,
            "longitude": -73.12345
          },
          "recommendations": 7,
          "ratings_counts": {
            "1": 0,
            "2": 1,
            "3": 0,
            "4": 5,
            "5": 8
          }
        }
      ]
    },
    {
      "list_id": 3,
      "name": "Pizza Places to Avoid",
      "is_ordered": true,
      "is_private": false,
      "is_flagged": false,
      "is_visible": true,
      "created_at": "2023-03-20T17:45:00Z",
      "places": []
    }
  ]
}
```

### Future Endpoints

##### `GET /api/users/:user_id/photos`

##### `GET /api/users/:user_id/reviews`

##### `GET /api/users/:user_id/activity`

##### `POST /api/users/:user_id/following`

##### `GET /api/users/:user_id/followers`

##### `GET /api/users/:user_id/following`

##### `GET /api/users/:user_id/following/activity`

##### `DELETE /api/users/:user_id/following/:followee_id`

##### `POST /api/users/:user_id/block`

##### `GET /api/users/:user_id/blocked`

##### `PUT /api/users/:user_id/flag`

## Places

### `GET /api/places`

Retrieves a list of places. Should not return places with or “is_archived” set to true or “is_approved” set to false.

### Query Parameters

| Name | Data Type | Required/Optional | Description |
| --- | --- | --- | --- |
| page | Integer | Optional | Page of results to be returned. |
| limit | Integer | Optional | Maximum number of returned records. |

### Example Request:

```jsx
GET /api/places?page=1&limit=10
```

### Response Codes

| Code | Description |
| --- | --- |
| 200 | Successful operation |

### Response payload

```json
{
  "page": 1,
  "limit": 10,
  "total_places": 45,
  "links": {
    "first": "/api/places?page=1&limit=10",
    "last": "/api/places?page=5&limit=10",
    "next": "/api/places?page=2&limit=10",
    "prev": null
  },
  "places": [
    {
      "id": 1,
      "google_places_id": "xyz123",
      "name": "Sample Place 1",
      "address": "123 Main St",
      "city": "Sample City",
      "state": "CA",
      "zip": "12345",
		  "loc": {
		    "lat": 37.12345,
		    "lng": -122.54321
		  },
      "recommendations": 42,
      "ratings_counts": {
        "1": 10,
        "2": 5,
        "3": 8,
        "4": 12,
        "5": 7
      },
      "is_operational": true,
      "created_at": "2023-09-09T12:34:56Z",
      "updated_at": "2023-09-10T14:00:00Z",
    },
    {
      "id": 2,
      "google_places_id": "abc789",
      "name": "Sample Place 2",
      "address": "456 Elm St",
      "city": "Sample Town",
      "state": "NY",
      "zip": "54321",
		  "loc": {
		    "lat": 37.12345,
		    "lng": -122.54321
		  },
      "recommendations": 15,
      "ratings_counts": {
        "1": 3,
        "2": 2,
        "3": 4,
        "4": 4,
        "5": 2
      },
      "is_operational": true,
      "flagged": false,
      "created_at": "2023-09-11T10:45:00Z",
      "updated_at": "2023-09-11T11:30:00Z"
    },
		// ...
  ]
}
```

### `GET /api/places/:place_id`

Retrieves detailed information for a given place ID. Should not return places with “is_archived” set to true or “is_approved” set to false unless the current user has admin privilieges.

### Authentication

Authentication is not required for a standard request.

Authentication is required in the form of `Authorization: Bearer <access_token>` when attempting to request a place that has been archived or has not been approved. To retrieve information for a place that is archived or not yet approved, the user making the request should have admin privileges.

### Example Request

```jsx
GET /api/places/123
```

### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 | Successful operation |
| 404 | Not found or user does not have admin privileges |

### Response Payload

```json
{
  "id": 123,
  "google_places_id": "abc123",
  "name": "Pizza Palace",
  "address": "123 Main St",
  "city": "Sampleville",
  "state": "CA",
  "zip": "12345",
  "loc": {
    "lat": 37.12345,
    "lng": -122.54321
  },
  "recommendations": 42,
  "ratings_counts": {
    "1": 2,
    "2": 5,
    "3": 10,
    "4": 15,
    "5": 10
  },
  "is_operational": true,
  "is_archived": false,
  "is_approved": true,
  "created_by": 456
  "approved_by": 789
  "flagged": false,
  "created_at": "2023-09-09T12:34:56Z",
  "updated_at": "2023-09-10T10:23:45Z",
  "archived_at": null
}
```

### Future Endpoints

##### `GET /api/places/:place_id/reviews`

##### `GET /api/places/:place_id/photos`

##### `POST /api/places/:place_id/reviews`

##### `POST /api/places/:place_id/photos`

##### `POST /api/places/`

##### `PUT /api/places/:place_id`

##### `DELETE /api/places/:place_id`

##### `PUT /api/places/:place_id/flag`

## Lists

### `GET /api/lists`

Retrieves user created lists. Should not return places with or “is_archived” set to true or “is_approved” set to false.

### Query Parameters

| Name | Data Type | Required/Optional | Description |
| --- | --- | --- | --- |
| page | Integer | Optional | Page of results to be returned. |
| limit | Integer | Optional | Maximum number of returned records. |

### Example Request:

```jsx
GET /api/lists?page=1&limit=10
```

### Response Codes

| Code | Description |
| --- | --- |
| 200 | Successful operation |

### Response Payload

```jsx
{
  "page": 1,
  "limit": 10,
  "total_lists": 3,
	"links": {
		"first": "/api/lists?page=1&limit=10",
		"last": "/api/lists?page=1&limit=10",
		"next": null,
		"prev": null
	},
  "lists": [
    {
      "id": 1,
      "user_id": 123,
      "name": "My Favorite Pizza Places",
      "created_at": "2023-09-09T14:30:00Z"
    },
    {
      "id": 2,
      "user_id": 456,
      "name": "Weekend Pizza Tour",
      "created_at": "2023-09-10T09:15:00Z"
    },
    {
      "id": 3,
      "user_id": 789,
      "name": "Hidden Gems",
      "created_at": "2023-09-11T16:45:00Z"
    }
  ]
}
```

### `GET /api/lists/:list_id`

Retrieve detailed information and the places (spots) saved within the list for a given list id.

### Authentication

Authentication is not required.

Authentication is required in the form of `Authorization: Bearer <access_token>` when making a request to a list that is set to private.

### User Privileges

When a list is set to private, the request should be made on behalf of the user that created the list or by a user with admin privileges.

When a list’s “is_visible” field is set to false, the request should be made by a user with admin privileges.

### Example Request

```jsx
GET /api/lists/123
```

### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 | Successful operation |
| 404 | Not found or inadequate user privileges |

### Response Payload

```jsx
{
  "id": 1,
  "user_id": 123,
  "name": "Favorite Pizza Places",
  "is_ordered": false,
  "is_private": false,
  "is_flagged": false,
  "is_visible": true,
  "created_at": "2023-09-09T14:12:34Z",
  "places": [
    {
      "id": 101,
      "google_places_id": "place-abc123",
      "name": "Pizzeria Uno",
      "address": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345",
      "loc": {
				"lat": 34.0522
				"lng": -118.2437,
      },
      "recommendations": 5,
      "ratings_counts": {
        "1": 2,
        "2": 3,
        "3": 5,
        "4": 10,
        "5": 20
      },
      "is_operational": true,
      "is_archived": false,
      "flagged": false,
      "created_at": "2023-09-09T14:30:00Z",
      "updated_at": "2023-09-09T15:45:00Z",
      "archived_at": null
    },
    {
      "id": 102,
      "google_places_id": "place-def456",
      "name": "Pizza Hut",
      "address": "456 Elm St",
      "city": "Another Town",
      "state": "NY",
      "zip": "54321",
      "loc": {
				"lat": 34.0522
				"lng": -118.2437,
      },
      "recommendations": 3,
      "ratings_counts": {
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 5,
        "5": 10
      },
      "is_operational": true,
      "is_archived": false,
      "flagged": false,
      "created_at": "2023-09-10T09:00:00Z",
      "updated_at": "2023-09-10T10:15:00Z",
      "archived_at": null
    }
  ]
}
```

### `POST /api/lists`

Creates a new list.

### Authentication

Authentication is required in the form of `Authorization: Bearer <access_token>`.

### Request Body

```jsx
{
  "name": "My Favorite Pizza Places"
}
```

### Example Request

```jsx
POST /api/lists
```

### Response Codes

| HTTP Code | Description |
| --- | --- |
| 201 | Successful operation |
| 400 | One or more fields are missing or invalid |

### Response Payload

```jsx
{
  "id": 123,
  "name": "My Favorite Pizza Places",
  "is_ordered": false,
  "is_private": false,
  "is_flagged": false,
  "is_visible": true,
  "created_at": "2023-09-09T12:34:56Z",
  "user_id": 456
}
```

### `POST /api/lists/:list_id/spots`

Add spots to an already created list.

### Authentication

Authentication is required in the form of `Authorization: Bearer <access_token>`.

### User Privileges

The request should be made on behalf of the user who created the list.

### Request Body

```jsx
{
  "place_id": 789
}
```

### Example Request

```jsx
POST /api/lists/123/spots
```

### Response Codes

### Response Codes

| HTTP Code | Description |
| --- | --- |
| 201 | Successful operation |
| 400 | One or more fields are missing or invalid |

### Response Payload

No response payload.

### `DELETE /api/lists/:list_id/spots/:spot_id`

Removes a spot from a given list.

### Authentication

Authentication is required in the form of `Authorization: Bearer <access_token>`.

### User Privileges

The request should be made on behalf of the user who created the list.

### Example Request

```jsx
DELETE /api/lists/123/spots/12
```

### Response Codes

| HTTPS Code | Description |
| --- | --- |
| 204 | Successful operation |

### `PUT /api/lists/:list_id`

Update a list created by current user.

### Authentication

Authentication is required in the form of `Authorization: Bearer <access_token>`.

### User Privileges

The request should be made on behalf of the user who created the list or a user with admin privileges.

### Example Request

```jsx
PUT /api/lists/123 HTTP/1.1
Authorization: Bearer <<access_token>>
Content-Type: application/json

{
  "id": 123,
  "user_id": 456,
  "name": "My List",
  "is_ordered": true,
  "is_private": true,
  "is_flagged": false,
  "is_visible": false,
  "created_at": "2023-09-15T14:30:00.000Z"
}
```

### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 | Operation Successful |
| 403 | Invalid user ID provided / Wrong user privileges  |

### Example Response

```jsx
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "user_id": 456,
  "name": "My List",
  "is_ordered": true,
  "is_private": true,
  "is_flagged": false,
  "is_visible": false,
  "created_at": "2023-09-15T14:30:00.000Z"
}
```

### `DELETE /api/lists/:list_id`

Deletes a list and all spots associated with the list.

### Authentication

Authentication is required in the form of `Authorization: Bearer <access_token>`.

### User Privileges

The request should be made on behalf of the current user or by a user with admin privileges.

### Example Request

```jsx
DELETE /api/lists/123
```

### Response Codes

| HTTP Code | Description |
| --- | --- |
| 204 | Successful operation |

### `PUT /api/lists/:list_id/spots/:spot_id`

Update a list item for a list created by the current user.

### Authentication

Authentication is required in the form of `Authorization: Bearer <access_token>`.

### User Privileges

The request should be made on behalf of the user who created the list or a user with admin privileges.

### Example Request

```jsx
PUT /api/lists/123/spots/1 HTTP/1.1
Authorization: Bearer <<access_token>>
Content-Type: application/json

{
  "position": 2,
  "is_completed": true
}
```

### Response Codes

| HTTP Code | Description |
| --- | --- |
| 200 | Successful operation |
| 403 | Invalid List ID or Spot ID / Wrong user privileges |

### Response Example

```jsx
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 456,
  "list_id": 123,
  "place_id": 789,
  "position": 2,
  "is_completed": true,
  "added_at": "2023-09-15T15:00:00.000Z"
}
```

### Future Endpoints

##### `PUT /api/lists/:list_id/flag`

## Ratings & Reviews

No ratings & reviews endpoints to be included with initial release.

### Future Endpoints

##### `GET /api/reviews`

##### `GET /api/reviews/:review_id`

##### `PUT /api/reviews/:review_id/flag`

##### `POST /api/reviews/:review_id/photos`

##### `PUT /api/reviews/:review_id`

##### `DELETE /api/reviews/:review_id`

##### `GET /api/photos`

##### `GET /api/photos/:photo_id`

##### `PUT /api/photos/:photo_id`

##### `DELETE /api/photos/:photo_id`

##### `PUT /api/photos/:id/flag`

## Activity

No activity endpoints to be included with initial release.

### Future Endpoints

##### `GET /api/activity`

##### `POST /api/activity`

##### `PUT /api/activity/:activity_id`

##### `PUT /api/activity/:activity_id/flag`

##### `DELETE /api/activity/:activity_id`

# Flags

No flag endpoints to be included with initial release.

### Future Endpoints

#### `GET /api/flags`

#### `GET /api/flags/:flag_id`

#### `PUT /api/flags/:flag_id`

#### `DELETE /api/flags/:flag_id`