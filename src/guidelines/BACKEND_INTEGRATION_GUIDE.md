# Frontend-Backend Integration Guide

## Current Frontend API Setup ✅

Your frontend (`src/lib/api.ts`) is already well-configured with:
- ✅ Environment-based API URL configuration
- ✅ JWT Bearer token authentication
- ✅ Request interceptor for token injection
- ✅ Response interceptor with automatic token refresh
- ✅ Credentials support for cookies
- ✅ Refresh token rotation logic

### Environment Variables Needed

Create `.env` in your frontend root:

```env
# Development
VITE_API_BASE_URL=http://localhost:4000/api

# Staging
# VITE_API_BASE_URL=https://staging-api.sasamum.app/api

# Production
# VITE_API_BASE_URL=https://api.sasamum.app/api
```

## Backend Setup Requirements

Your backend needs to implement these endpoints to work with the frontend:

### 1. Authentication Endpoints

#### POST `/api/auth/register`
Registers a new user (either patient or provider).

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "userType": "patient" | "provider",
  "name": "John Doe",
  "phone": "+254722123456",
  "facilityName": "Optional facility name for providers"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "patient"
  }
}
```

#### POST `/api/auth/login`
Authenticates user and returns tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** (Same as register)

#### POST `/api/auth/refresh`
Refreshes expired JWT token.

**Request:**
```json
{
  "token": "refresh_token_value"
}
```

**Response:**
```json
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

#### POST `/api/auth/logout`
Invalidates current tokens.

**Request:**
```json
{
  "token": "current_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 2. User Profile Endpoints

#### GET `/api/users/:id`
Gets user profile.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+254722123456",
  "avatar": "https://...",
  "bio": "User bio",
  "location": "Nairobi",
  "userType": "patient",
  "currentWeek": 20,
  "dueDate": "2025-06-15",
  "privacySettings": {
    "showLocation": true,
    "onlineStatus": true
  }
}
```

#### PUT `/api/users/:id`
Updates user profile.

**Request:**
```json
{
  "name": "Jane Doe",
  "bio": "Updated bio",
  "location": "Westlands, Nairobi",
  "privacySettings": {
    "showLocation": false,
    "onlineStatus": true
  }
}
```

**Response:** Updated user object (same as GET)

### 3. Pregnancy Tracking Endpoints

#### GET `/api/pregnancy/:userId`
Gets pregnancy information for user.

**Response:**
```json
{
  "userId": "user_123",
  "currentWeek": 20,
  "dueDate": "2025-06-15",
  "lastMenstrualPeriod": "2024-12-09",
  "vitalSigns": {
    "weight": "72kg",
    "bloodPressure": "120/80",
    "hemoglobin": "12.5"
  },
  "symptoms": ["nausea", "fatigue"],
  "appointments": [
    {
      "id": "apt_1",
      "date": "2024-11-20",
      "type": "checkup",
      "provider": "Dr. Odhiambo",
      "notes": "Regular prenatal checkup"
    }
  ]
}
```

#### POST `/api/pregnancy/:userId/vitals`
Logs vital signs.

**Request:**
```json
{
  "date": "2024-11-15",
  "weight": "72kg",
  "bloodPressure": "120/80",
  "heartRate": 72,
  "hemoglobin": "12.5",
  "notes": "Feeling good"
}
```

#### POST `/api/pregnancy/:userId/symptoms`
Logs symptoms.

**Request:**
```json
{
  "date": "2024-11-15",
  "symptoms": ["nausea", "fatigue"],
  "severity": "mild",
  "notes": "Morning sickness"
}
```

### 4. Appointments Endpoints

#### GET `/api/appointments`
Gets user's appointments.

**Query parameters:**
- `status`: 'scheduled', 'completed', 'cancelled'
- `startDate`: ISO date string
- `endDate`: ISO date string

**Response:**
```json
{
  "appointments": [
    {
      "id": "apt_1",
      "date": "2024-11-20T10:00:00Z",
      "provider": "Dr. Carol Odhiambo",
      "type": "checkup",
      "location": "Women's Health Clinic",
      "notes": "Regular checkup",
      "status": "scheduled"
    }
  ],
  "total": 1
}
```

#### POST `/api/appointments`
Creates new appointment.

**Request:**
```json
{
  "date": "2024-11-20T10:00:00Z",
  "providerId": "provider_123",
  "type": "checkup",
  "notes": "Routine checkup"
}
```

#### PUT `/api/appointments/:id`
Updates appointment.

#### DELETE `/api/appointments/:id`
Cancels appointment.

### 5. Chat/Messaging Endpoints

#### GET `/api/chat/conversations`
Gets user's chat conversations.

**Response:**
```json
{
  "conversations": [
    {
      "id": "conv_1",
      "participantId": "user_456",
      "participantName": "Dr. Sarah Johnson",
      "lastMessage": "How are you feeling?",
      "lastMessageTime": "2024-11-15T14:30:00Z",
      "unreadCount": 2
    }
  ]
}
```

#### GET `/api/chat/conversations/:id/messages`
Gets messages in a conversation.

**Query parameters:**
- `limit`: 50 (default)
- `offset`: 0 (for pagination)

#### POST `/api/chat/conversations/:id/messages`
Sends a message.

**Request:**
```json
{
  "message": "Hello, how are you?"
}
```

### 6. PDF Generation Endpoints

#### POST `/api/pdf/birth-plan`
Generates birth plan PDF.

**Request:**
```json
{
  "userId": "user_123",
  "preferences": {
    "laborPreferences": ["natural delivery", "epidural available"],
    "deliveryPreferences": ["skin-to-skin", "delayed cord clamping"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "downloadUrl": "https://api.sasamum.app/downloads/birth-plan-user123.pdf",
  "expiresIn": 3600
}
```

#### POST `/api/pdf/pregnancy-summary`
Generates pregnancy summary PDF.

**Request:**
```json
{
  "userId": "user_123"
}
```

## Database Schema (PostgreSQL Recommended)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  bio TEXT,
  location VARCHAR(255),
  user_type VARCHAR(50), -- 'patient' or 'provider'
  facility_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pregnancy data
CREATE TABLE pregnancy_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_week INT,
  due_date DATE,
  last_menstrual_period DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vital signs
CREATE TABLE vital_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recorded_date DATE,
  weight VARCHAR(50),
  blood_pressure VARCHAR(50),
  heart_rate INT,
  hemoglobin DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Symptoms
CREATE TABLE symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symptom_date DATE,
  symptoms JSONB,
  severity VARCHAR(50), -- 'mild', 'moderate', 'severe'
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  appointment_date TIMESTAMP,
  type VARCHAR(100), -- 'checkup', 'ultrasound', etc.
  location VARCHAR(255),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages/Chat
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  participant_2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_pregnancy_user_id ON pregnancy_data(user_id);
CREATE INDEX idx_vital_signs_user_id ON vital_signs(user_id);
CREATE INDEX idx_symptoms_user_id ON symptoms(user_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
```

## Testing the Integration

### 1. Test Registration Flow

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123",
    "userType": "patient",
    "name": "Test User",
    "phone": "+254722123456"
  }'
```

### 2. Test Authentication

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123"
  }'
```

Save the returned `token` and use it in subsequent requests:

```bash
curl -X GET http://localhost:4000/api/users/user_123 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Test Token Refresh

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your_refresh_token_here"
  }'
```

## Frontend Implementation Checklist

- [ ] Verify environment variables are set
- [ ] Test login flow with backend
- [ ] Test token refresh on 401 response
- [ ] Test logout flow
- [ ] Test data fetching with proper headers
- [ ] Test error handling
- [ ] Verify CORS configuration
- [ ] Test on both development and staging

## Next Steps

1. **Implement Backend** - Start with authentication and user management
2. **Test Integration** - Use curl/Postman to verify API endpoints
3. **Add Error Handling** - Ensure proper error messages and recovery
4. **Implement Security** - Add rate limiting, input validation
5. **Add Logging** - Track API calls and errors
6. **Performance Testing** - Load test critical endpoints
7. **Documentation** - Keep API docs updated

