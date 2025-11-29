# ChatMe API Documentation

## Base URL
```
https://5673766c-0cb9-4eb2-ba61-380c90ae9383-00-107h8sd6jgwdl.sisko.replit.dev:8000
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 📊 Ranking Endpoints

### Get Fans Ranking
Get ranking of fans who sent gifts to a specific host.

**Endpoint:** `GET /api/ranking/fans/:hostId`

**Parameters:**
- `hostId` (path) - ID of the host
- `period` (query) - Filter period: `daily`, `weekly`, or `all` (default: `daily`)

**Example:**
```bash
GET /api/ranking/fans/1?period=daily
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "id": 5,
      "name": "User Name",
      "avatar": "https://i.pravatar.cc/150?img=5",
      "level": 28,
      "coins": 15420
    }
  ],
  "period": "daily",
  "hostId": "1"
}
```

---

### Get Hosts Ranking
Get ranking of hosts who received the most gifts.

**Endpoint:** `GET /api/ranking/hosts`

**Parameters:**
- `period` (query) - Filter period: `daily`, `weekly`, or `all` (default: `daily`)

**Example:**
```bash
GET /api/ranking/hosts?period=weekly
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "id": 3,
      "name": "Host Name",
      "avatar": "https://i.pravatar.cc/150?img=3",
      "level": 35,
      "coins": 125000
    }
  ],
  "period": "weekly"
}
```

---

## 🎁 Gifts Endpoints

### Send Gift
Send a gift to another user (requires authentication).

**Endpoint:** `POST /api/gifts/send`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "receiverId": 2,
  "giftName": "Rose",
  "coinValue": 100,
  "quantity": 5
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Gift berhasil dikirim",
  "data": {
    "giftId": 123,
    "totalCost": 500,
    "createdAt": "2024-11-17T10:30:00.000Z"
  }
}
```

**Response Error (Insufficient Balance):**
```json
{
  "success": false,
  "message": "Saldo tidak cukup",
  "required": 500,
  "current": 200
}
```

---

### Get Gift History
Get gift history (sent or received) for the authenticated user.

**Endpoint:** `GET /api/gifts/history`

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `type` (query) - Type of history: `sent` or `received` (default: `sent`)

**Example:**
```bash
GET /api/gifts/history?type=sent
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "sender_id": 1,
      "receiver_id": 2,
      "gift_name": "Rose",
      "coin_value": 100,
      "quantity": 5,
      "created_at": "2024-11-17T10:30:00.000Z",
      "receiver_name": "Receiver Name",
      "receiver_avatar": "https://..."
    }
  ],
  "type": "sent"
}
```

---

## 👤 Auth Endpoints

### Register
Create a new user account.

**Endpoint:** `POST /api/register`

**Body:**
```json
{
  "phone": "081234567890",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil!"
}
```

---

### Login
Login with phone number and password.

**Endpoint:** `POST /api/login`

**Body:**
```json
{
  "phone": "081234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "User Name",
    "phone": "081234567890"
  }
}
```

---

### Get Profile
Get authenticated user profile.

**Endpoint:** `GET /api/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "User Name",
    "phone": "081234567890",
    "balance": 5000,
    "level": 25,
    "vipLevel": 2,
    "avatar_url": "https://..."
  }
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) DEFAULT 'Pengguna Baru',
  avatar_url TEXT,
  balance INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  vip_level INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Gifts Table
```sql
CREATE TABLE gifts (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  gift_name VARCHAR(100) NOT NULL,
  coin_value INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Error Responses

All endpoints may return these error responses:

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Token tidak ditemukan"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Token tidak valid"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Endpoint /api/unknown tidak ditemukan."
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Server error"
}
```
