# Auto Mail Sending - API Documentation

## Base URL

```
http://localhost:PORT/api
```

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Email Management Endpoints](#email-management-endpoints)
3. [Common Status Codes](#common-status-codes)
4. [Error Response Format](#error-response-format)
5. [Authentication](#authentication)

---

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Description:** Register a new user account

**Required Data:**

```json
{
  "fullName": "string (required)",
  "userEmail": "string (required, unique email)",
  "password": "string (required)"
}
```

**Response (Status: 201 - Created):**

```json
{
  "statusCode": 201,
  "data": {
    "_id": "user_id",
    "fullName": "john doe",
    "userEmail": "john@example.com",
    "emailAccounts": [],
    "__v": 0
  },
  "message": "User Registered Successfully",
  "success": true
}
```

**Error Responses:**

- **400** - Some fields are missing
- **409** - User Already exists

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Description:** Login user and get access token (refresh token set as HTTP-only cookie)

**Required Data:**

```json
{
  "userEmail": "string (required)",
  "password": "string (required)"
}
```

**Response (Status: 200 - OK):**

```json
{
  "statusCode": 200,
  "data": {
    "userExist": {
      "_id": "user_id",
      "fullName": "john doe",
      "userEmail": "john@example.com",
      "emailAccounts": [
        {
          "email": "sender@gmail.com",
          "googleAppPassword": "xxxx xxxx xxxx xxxx"
        }
      ],
      "__v": 0
    },
    "accessToken": "jwt_token_here"
  },
  "message": "User Login Successfully",
  "success": true
}
```

**Cookies Set:**

- `refreshToken` - HTTP-only cookie (7 days expiry)

**Error Responses:**

- **400** - Email and password are required
- **404** - User doesn't exists

---

### 3. Refresh Access Token

**Endpoint:** `POST /auth/refresh`

**Description:** Refresh expired access token using refresh token from cookies

**Required Data:** None (uses refreshToken from cookies)

**Response (Status: 200 - OK):**

```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "new_jwt_token_here",
    "user": {
      "_id": "user_id",
      "fullName": "john doe",
      "userEmail": "john@example.com",
      "emailAccounts": [
        {
          "email": "sender@gmail.com",
          "googleAppPassword": "xxxx xxxx xxxx xxxx"
        }
      ],
      "__v": 0
    }
  },
  "message": "Access token refreshed successfully",
  "success": true
}
```

**Cookies Set:**

- `refreshToken` - New HTTP-only cookie (7 days expiry)

**Error Responses:**

- **401** - Unauthorized request (missing refresh token)
- **401** - Invalid refresh token

---

### 4. Get User Profile

**Endpoint:** `GET /auth/profile`

**Description:** Get logged-in user profile information

**Authentication:** Required (Bearer Token in Authorization header)

**Required Data:** None

**Response (Status: 200 - OK):**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "john doe",
    "userEmail": "john@example.com",
    "emailAccounts": [
      {
        "email": "sender@gmail.com",
        "googleAppPassword": "xxxx xxxx xxxx xxxx"
      }
    ],
    "__v": 0
  },
  "message": "user fetched successfully",
  "success": true
}
```

**Error Responses:**

- **401** - Unauthorized (missing or invalid token)
- **404** - User not found

---

### 5. Update User Profile

**Endpoint:** `POST /auth/update`

**Description:** Update user's linked email accounts for sending emails

**Authentication:** Required (Bearer Token in Authorization header)

**Required Data:**

```json
{
  "emailAccounts": [
    {
      "email": "sender@gmail.com",
      "googleAppPassword": "xxxx xxxx xxxx xxxx"
    }
  ]
}
```

**Notes:**

- `emailAccounts` must be a non-empty array
- Each email account requires email and googleAppPassword
- googleAppPassword should be a Gmail App Password (not regular password)

**Response (Status: 200 - OK):**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "john doe",
    "userEmail": "john@example.com",
    "emailAccounts": [
      {
        "email": "sender@gmail.com",
        "googleAppPassword": "xxxx xxxx xxxx xxxx"
      }
    ],
    "__v": 0
  },
  "message": "Profile updated successfully",
  "success": true
}
```

**Error Responses:**

- **400** - emailAccounts is required
- **401** - Unauthorized
- **404** - User not found

---

### 6. User Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logout user and clear refresh token cookie

**Authentication:** Required (Bearer Token in Authorization header)

**Required Data:** None

**Response (Status: 200 - OK):**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Logged out",
  "success": true
}
```

**Cookies Cleared:**

- `refreshToken` - Cleared

**Error Responses:**

- **401** - Unauthorized

---

## Email Management Endpoints

### 1. Show All Subscriber Emails

**Endpoint:** `GET /email/showsubEmails`

**Description:** Get all subscriber emails grouped by categories

**Authentication:** Required (Bearer Token in Authorization header)

**Required Data:** None

**Response (Status: 200 - OK):**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "subemail_document_id",
    "user": "user_id",
    "groups": [
      {
        "groupName": "General",
        "emails": ["subscriber1@example.com", "subscriber2@example.com"]
      },
      {
        "groupName": "Newsletter",
        "emails": ["subscriber3@example.com"]
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "__v": 0
  },
  "message": "fetched successfully",
  "success": true
}
```

**Error Responses:**

- **401** - Unauthorized
- **404** - No subscriber emails found

---

### 2. Add Single Email

**Endpoint:** `GET /email/addsubEmail`

**Description:** Add a single subscriber email to a group

**Authentication:** Required (Bearer Token in Authorization header)

**Required Data:**

```json
{
  "email": "subscriber@example.com (required)",
  "groupName": "string (optional, default: 'General')"
}
```

**Constraints:**

- Maximum 1000 total emails per user
- Maximum 500 emails per group
- Maximum 5 groups per user
- Duplicate emails not allowed

**Response (Status: 200 - OK):**

```json
{
  "success": true,
  "message": "Email added successfully"
}
```

**Error Responses:**

- **400** - Email is required
- **400** - Email already exists in one of your groups
- **400** - Total 1000 emails limit reached
- **400** - Maximum 5 groups allowed
- **400** - Group limit of 500 reached
- **401** - Unauthorized

---

### 3. Upload Bulk Emails

**Endpoint:** `GET /email/uploadEmails`

**Description:** Upload multiple subscriber emails from a CSV or text file

**Authentication:** Required (Bearer Token in Authorization header)

**Required Data:**

- **File:** Multipart form data with key `myFile`
  - Supported formats: Any file containing email addresses (CSV, TXT, etc.)
  - Maximum 500 emails per file
  - Email regex pattern: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`

**Optional Data:**

```json
{
  "groupName": "string (optional, default: 'General')"
}
```

**File Format Example (CSV):**

```
subscriber1@example.com
subscriber2@example.com
subscriber3@example.com
```

**Constraints:**

- Maximum 500 unique emails per file
- Maximum 1000 total emails per user
- Maximum 500 emails per group
- Duplicate checking across all groups

**Response (Status: 200 - OK):**

```json
{
  "success": true,
  "message": "Bulk upload successful"
}
```

**Error Responses:**

- **400** - File is required
- **400** - File exceeds 500 emails limit
- **400** - Adding these would exceed the 1000 total email limit
- **400** - Max 5 groups limit reached
- **400** - Not enough space in group "groupName". Max 500 allowed
- **401** - Unauthorized

---

### 4. Send Email

**Endpoint:** `POST /email/sendEmail`

**Description:** Send email to recipients using configured email account

**Authentication:** Required (Bearer Token in Authorization header)

**Required Data:**

```json
{
  "from": "sender@gmail.com (required, must be a configured email account)",
  "to": "recipient@example.com (optional)",
  "bcc": "bcc1@example.com,bcc2@example.com (optional)",
  "subject": "string (required)",
  "text": "string (required for plain text email)",
  "html": "string (optional, for HTML email. Falls back to text if not provided)"
}
```

**Notes:**

- At least one of `to` or `bcc` must be provided
- `from` email must be one of the user's configured email accounts
- `html` will be used for email body if provided, otherwise `text` is used
- Email accounts must be configured in user profile with valid Gmail App Passwords
- Multiple recipients can be added using comma-separated emails in BCC

**Response (Status: 200 - OK):**

```json
{
  "success": true,
  "message": "Email sent!"
}
```

**Error Responses:**

- **400** - Some required fields are missing
- **401** - Unauthorized
- **404** - User not found
- **404** - Sender account not linked!
- **500** - Error sending email (with error message from Nodemailer)

**Example Request:**

```json
{
  "from": "sender@gmail.com",
  "to": "recipient@example.com",
  "bcc": "bcc1@example.com,bcc2@example.com",
  "subject": "Hello from Auto Mail",
  "text": "This is a test email",
  "html": "<h1>Hello</h1><p>This is a test email</p>"
}
```

---

## Common Status Codes

| Code    | Meaning               | Description                                     |
| ------- | --------------------- | ----------------------------------------------- |
| **200** | OK                    | Request successful                              |
| **201** | Created               | Resource created successfully                   |
| **400** | Bad Request           | Missing or invalid data in request              |
| **401** | Unauthorized          | Missing or invalid authentication token         |
| **404** | Not Found             | Resource not found                              |
| **409** | Conflict              | Resource already exists (e.g., duplicate email) |
| **500** | Internal Server Error | Server error during processing                  |

---

## Error Response Format

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message describing what went wrong",
  "success": false
}
```

---

## Authentication

### How to Authenticate

1. **Login** using `/auth/login` endpoint to get `accessToken`
2. **Set Authorization Header** for protected routes:
   ```
   Authorization: Bearer <accessToken>
   ```
3. **Refresh Token:** When access token expires (15 minutes), use `/auth/refresh` to get a new one
4. **Refresh token** is automatically managed via HTTP-only cookies (7 days expiry)

### Protected Routes

All routes under `/email/**` require authentication. Additionally:

- `/auth/logout` - Requires authentication
- `/auth/profile` - Requires authentication
- `/auth/update` - Requires authentication

### JWT Token Details

- **Access Token Expiry:** 15 minutes
- **Refresh Token Expiry:** 7 days
- **Refresh Token Storage:** HTTP-only cookie (secure in production)

---

## Data Models

### User Model

```javascript
{
  _id: ObjectId,
  fullName: String,
  userEmail: String (unique, lowercase),
  password: String (hashed),
  emailAccounts: [
    {
      email: String (lowercase),
      googleAppPassword: String
    }
  ],
  __v: Number
}
```

### Subscriber Emails Model

```javascript
{
  _id: ObjectId,
  user: ObjectId (reference to User),
  groups: [
    {
      groupName: String,
      emails: [String]
    }
  ],
  createdAt: Date,
  updatedAt: Date,
  __v: Number
}
```

---

## Important Notes

1. **Unique Constraints:**
   - User email must be unique
   - Subscriber emails must be unique across all groups within one user

2. **Limits:**
   - Maximum 1000 total emails per user
   - Maximum 5 groups per user
   - Maximum 500 emails per group
   - Maximum 500 emails per file upload

3. **Gmail Configuration:**
   - Use Gmail App Passwords instead of regular passwords
   - App Password format: `xxxx xxxx xxxx xxxx` (16 characters with spaces)

4. **CORS Settings:**
   - Frontend URL: `http://localhost:5173`
   - Credentials: Enabled (cookies will be sent/received)

5. **Email Sending:**
   - Uses Gmail's SMTP service
   - Sender email must be configured in user's email accounts
   - Both `to` and `bcc` can be used simultaneously

---

## Version

- **Version:** 1.0.0
- **Last Updated:** April 2026
