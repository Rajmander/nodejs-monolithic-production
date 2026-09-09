# API Documentation & Endpoint Specification

Interactive Swagger UI is accessible at:
```
http://localhost:3000/api/docs
```

The server base URL for all domain routes is `/api/v1`.

---

## 1. Response & Error Envelopes

### Standard Success Response Envelope
All successful responses are wrapped in a uniform JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Resource created successfully",
  "meta": {
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  },
  "timestamp": "2026-09-07T14:30:00.000Z"
}
```

### RFC 7807 Problem Details Error Envelope
When any client error (4xx) or server error (5xx) occurs, the response follows RFC 7807:
```json
{
  "type": "https://errors.api.enterprise.com/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "Request validation failed",
  "instance": "/api/v1/auth/register",
  "code": "VALIDATION_ERROR",
  "timestamp": "2026-09-07T14:30:00.000Z",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address format"
    }
  ]
}
```

---

## 2. Health Probes

### GET `/health/live`
- **Description**: Kubernetes liveness probe checking process heartbeat.
- **Auth**: None
- **Response**: `200 OK`

### GET `/health/ready`
- **Description**: Kubernetes readiness probe inspecting subsystem status and memory allocations.
- **Auth**: None
- **Response**: `200 OK`

---

## 3. Authentication Endpoints (`/api/v1/auth`)

### POST `/api/v1/auth/register`
- **Description**: Registers a new user account and returns JWT tokens.
- **Rate Limit**: 10 requests / 15 minutes.
- **Request Body**:
```json
{
  "email": "jane.doe@enterprise.com",
  "password": "StrongPassword123!",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "user"
}
```
- **Response**: `201 Created`

### POST `/api/v1/auth/login`
- **Description**: Verifies credentials and generates access/refresh tokens.
- **Rate Limit**: 10 requests / 15 minutes.
- **Request Body**:
```json
{
  "email": "jane.doe@enterprise.com",
  "password": "StrongPassword123!"
}
```
- **Response**: `200 OK`

### POST `/api/v1/auth/refresh`
- **Description**: Performs token rotation. Validates refresh token and issues a new access/refresh pair.
- **Request Body**:
```json
{
  "refreshToken": "<jwt-refresh-token>"
}
```
- **Response**: `200 OK`

### POST `/api/v1/auth/logout`
- **Description**: Revokes the refresh token and clears session state.
- **Request Body**:
```json
{
  "refreshToken": "<jwt-refresh-token>"
}
```
- **Response**: `200 OK`

---

## 4. User Endpoints (`/api/v1/users`)

All user endpoints require a Bearer token in the `Authorization` header (`Bearer <access-token>`).

### GET `/api/v1/users/me`
- **Description**: Returns profile information for the authenticated user.
- **Auth**: Any valid token.
- **Response**: `200 OK`

### PATCH `/api/v1/users/me`
- **Description**: Updates profile details (`firstName`, `lastName`).
- **Auth**: Any valid token.
- **Request Body**:
```json
{
  "firstName": "Janet"
}
```
- **Response**: `200 OK`

### GET `/api/v1/users`
- **Description**: Lists registered users with pagination, role filtering, and search.
- **Auth**: Requires `admin` or `manager` role.
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 10, max: 100)
  - `role` (enum: `admin`, `manager`, `user`)
  - `search` (string)
  - `sortBy` (enum: `createdAt`, `email`, `firstName`, `lastName`)
  - `sortOrder` (`asc` | `desc`)
- **Response**: `200 OK`

### GET `/api/v1/users/:id`
- **Description**: Retrieves user record by ID.
- **Auth**: Requires `admin` or `manager` role.
- **Response**: `200 OK`

---

## 5. Product Catalog Endpoints (`/api/v1/products`)

### GET `/api/v1/products`
- **Description**: Publicly accessible catalog search and pagination.
- **Query Parameters**:
  - `page`, `limit`, `category`, `search`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`
- **Response**: `200 OK`

### GET `/api/v1/products/:id`
- **Description**: Retrieves single product details.
- **Response**: `200 OK`

### POST `/api/v1/products`
- **Description**: Creates a new product.
- **Auth**: Requires `admin` or `manager` role.
- **Request Body**:
```json
{
  "name": "Wireless Ergonomic Mouse",
  "description": "2.4GHz precision wireless optical mouse",
  "price": 49.99,
  "sku": "MSE-WL-01",
  "category": "Electronics",
  "stockQuantity": 100
}
```
- **Response**: `201 Created`

### PUT `/api/v1/products/:id`
- **Description**: Updates product attributes.
- **Auth**: Requires `admin` or `manager` role.
- **Response**: `200 OK`

### DELETE `/api/v1/products/:id`
- **Description**: Deletes product from catalog.
- **Auth**: Requires `admin` role.
- **Response**: `204 No Content`
