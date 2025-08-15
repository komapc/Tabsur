# Tabsur Database Schema

This document describes the PostgreSQL database schema for the Tabsur meal-sharing platform.

## 🗄️ Overview

The database uses PostgreSQL with Flyway-style versioned migrations. Each migration file follows the pattern `V{version}__{description}.sql` and is applied sequentially.

## 📊 Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    USERS    │    │    MEALS    │    │   ATTENDS   │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │◄──┐│ id (PK)     │◄──┐│ id (PK)     │
│ name        │   ││ name        │   ││ user_id (FK)│
│ email       │   ││ host_id (FK)├───┘│ meal_id (FK)├───┘
│ password    │   ││ created_at  │    │ status      │
│ location    │   ││ type        │    │ created_at  │
│ address     │   ││ location    │    └─────────────┘
│ created_at  │   ││ address     │
│ facebook_id │   ││ guest_count │         ┌─────────────┐
│ fb_picture  │   ││ date        │         │   FOLLOW    │
└─────────────┘   ││ visibility  │         ├─────────────┤
       │          ││ description │    ┌───►│ id (PK)     │
       │          │└─────────────┘    │    │ follower(FK)├──┐
       │          │                   │    │ followee(FK)├──┤
       └──────────┼───────────────────┘    │ created_at  │  │
                  │                        └─────────────┘  │
                  │                                         │
                  │        ┌─────────────┐                  │
                  │        │    CHAT     │                  │
                  │        ├─────────────┤                  │
                  └───────►│ id (PK)     │◄─────────────────┘
                           │ from_id(FK) │
                           │ to_id (FK)  │
                           │ message     │
                           │ timestamp   │
                           │ seen        │
                           │ received    │
                           └─────────────┘

         ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
         │   IMAGES    │    │MEAL_IMAGES  │    │USER_IMAGES  │
         ├─────────────┤    ├─────────────┤    ├─────────────┤
         │ id (PK)     │◄──┐│ id (PK)     │    │ id (PK)     │
         │ path        │   ├┤ meal_id(FK) │    │ user_id(FK) │
         │ status      │   ││ image_id(FK)├───►│ image_id(FK)├───┘
         │ uploader    │   │└─────────────┘    └─────────────┘
         │ created_at  │   │
         └─────────────┘   │
                          │
         ┌─────────────┐   │    ┌─────────────┐
         │NOTIFICATIONS│   │    │   HUNGRY    │
         ├─────────────┤   │    ├─────────────┤
         │ id (PK)     │   │    │ id (PK)     │
         │ user_id(FK) ├───┘    │ user_id(FK) │
         │ meal_id(FK) │        │ location    │
         │ type        │        │ time        │
         │ message     │        │ created_at  │
         │ created_at  │        └─────────────┘
         │ seen        │
         │ seen_at     │
         │ from_user_id│
         └─────────────┘
```

## 📋 Table Definitions

### 🙋‍♂️ users
Stores user account information and profiles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing user ID |
| name | VARCHAR | NOT NULL | User's display name |
| email | VARCHAR | NOT NULL, UNIQUE | User's email address |
| password | VARCHAR | NOT NULL | Bcrypt hashed password |
| location | POINT | NOT NULL | Geographic coordinates |
| address | VARCHAR | NOT NULL | Human-readable address |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Account creation timestamp |
| facebook_id | VARCHAR | NULLABLE | Facebook OAuth ID |
| fb_picture | VARCHAR | NULLABLE | Facebook profile picture URL |

**Indexes:**
- `unique_user_email` (UNIQUE on email)

### 🍽️ meals
Represents meal events that users can host and attend.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing meal ID |
| name | VARCHAR | NOT NULL | Meal title/name |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Meal creation timestamp |
| type | VARCHAR | NULLABLE | Type of meal (breakfast, lunch, dinner) |
| location | POINT | NOT NULL | Geographic coordinates |
| address | VARCHAR | NOT NULL | Human-readable address |
| guest_count | INT | NOT NULL | Maximum number of guests |
| host_id | INTEGER | NOT NULL, FK → users.id | User hosting the meal |
| date | TIMESTAMPTZ | NULLABLE | When the meal will happen |
| visibility | BOOLEAN | DEFAULT true | Whether meal is publicly visible |
| description | TEXT | NULLABLE | Detailed meal description |

### 🎫 attends
Many-to-many relationship between users and meals for attendance tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing attendance ID |
| user_id | INTEGER | NOT NULL, FK → users.id | User attending the meal |
| meal_id | INTEGER | NOT NULL, FK → meals.id | Meal being attended |
| status | INTEGER | NOT NULL | Attendance status (0=requested, 1=confirmed, -1=declined) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | When attendance was requested |

**Unique Constraints:**
- `(user_id, meal_id)` - Users can only attend each meal once

### 👥 follow
Social following relationships between users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing follow ID |
| follower | INTEGER | NOT NULL, FK → users.id | User who is following |
| followee | INTEGER | NOT NULL, FK → users.id | User being followed |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | When the follow relationship started |

### 💬 chat
Direct messages between users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing message ID |
| from_id | INTEGER | NOT NULL, FK → users.id | Message sender |
| to_id | INTEGER | NOT NULL, FK → users.id | Message recipient |
| message | TEXT | NOT NULL | Message content |
| timestamp | TIMESTAMPTZ | DEFAULT NOW() | When message was sent |
| seen | BOOLEAN | DEFAULT false | Whether message has been read |
| received | BOOLEAN | DEFAULT false | Whether message was delivered |

### 🔔 notifications
System notifications for users about various events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing notification ID |
| user_id | INTEGER | NOT NULL, FK → users.id | User receiving notification |
| meal_id | INTEGER | NULLABLE, FK → meals.id | Related meal (if applicable) |
| type | VARCHAR | NOT NULL | Notification type |
| message | TEXT | NOT NULL | Notification content |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | When notification was created |
| seen | BOOLEAN | DEFAULT false | Whether user has seen notification |
| seen_at | TIMESTAMPTZ | NULLABLE | When notification was marked as seen |
| from_user_id | INTEGER | NULLABLE, FK → users.id | User who triggered notification |

### 📸 images
Stores metadata for uploaded images (files stored in AWS S3).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing image ID |
| path | VARCHAR | NOT NULL | S3 path/key for the image |
| status | INTEGER | DEFAULT 1 | Image status (1=active, 0=deleted) |
| uploader | INTEGER | NOT NULL, FK → users.id | User who uploaded the image |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Upload timestamp |

### 🖼️ meal_images
Links images to meals (many-to-many).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing link ID |
| meal_id | INTEGER | NOT NULL, FK → meals.id | Associated meal |
| image_id | INTEGER | NOT NULL, FK → images.id | Associated image |

### 👤 user_images
Links images to users for profile pictures and galleries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing link ID |
| user_id | INTEGER | NOT NULL, FK → users.id | Associated user |
| image_id | INTEGER | NOT NULL, FK → images.id | Associated image |

### 🍴 hungry
Stores "hungry" requests from users looking for meals in specific areas.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing hungry ID |
| user_id | INTEGER | NOT NULL, FK → users.id | User who is hungry |
| location | POINT | NOT NULL | Where user is looking for meals |
| time | TIMESTAMPTZ | NOT NULL | When user wants to eat |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | When request was created |

### 🔑 tokens
Stores authentication and refresh tokens.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing token ID |
| user_id | INTEGER | NOT NULL, FK → users.id | Token owner |
| token | VARCHAR | NOT NULL | Token value |
| type | VARCHAR | NOT NULL | Token type (refresh, reset, etc.) |
| expires_at | TIMESTAMPTZ | NOT NULL | Token expiration |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Token creation time |

### 📊 version
Tracks database migration version (Flyway-style).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| installed_rank | INTEGER | NOT NULL | Order of migration execution |
| version | VARCHAR(50) | PRIMARY KEY | Migration version number |
| description | VARCHAR(200) | NOT NULL | Migration description |
| type | VARCHAR(20) | NOT NULL | Migration type |
| script | VARCHAR(1000) | NOT NULL | Migration script name |
| checksum | INTEGER | NULLABLE | Migration checksum |
| installed_by | VARCHAR(100) | NOT NULL | User who ran migration |
| installed_on | TIMESTAMP | DEFAULT NOW() | When migration was run |
| execution_time | INTEGER | NOT NULL | Migration execution time in ms |
| success | BOOLEAN | NOT NULL | Whether migration succeeded |

## 🔄 Migration History

The database schema has evolved through 22+ migrations:

| Version | Description | Key Changes |
|---------|-------------|-------------|
| V1 | create_users_table | Initial users table |
| V2 | create_meals_table | Initial meals table |
| V3 | create_attends_table | Meal attendance system |
| V4 | create_notifications_table | Notification system |
| V5 | alter_users_add_email | Added email column to users |
| V6 | versioning | Added migration tracking |
| V8 | notifications_add_columns | Enhanced notification system |
| V9 | follow | Added social following |
| V10 | attends_unique | Unique constraint for attendance |
| V11 | meal_time | Added meal timing |
| V12 | meal_visibility_and_fb_id | Facebook integration |
| V13 | hungry_create_table | "Hungry" user requests |
| V14 | images | Image storage system |
| V15 | images_fixes | Image system improvements |
| V16 | images_uploader | Image uploader tracking |
| V17 | users_unique | Unique email constraint |
| V18 | tokens | Token management system |
| V19 | chat | Direct messaging system |
| V20 | chat_add_fields | Enhanced chat features |
| V21 | notifications_changes | Notification improvements |
| V22 | meal_description | Added meal descriptions |

## 🔧 Database Features

### Spatial Data
- Uses PostgreSQL POINT type for geographic coordinates
- Supports location-based meal discovery
- Efficient spatial queries for nearby meals

### Full-Text Search
- Meals can be searched by name and description
- Users can be found by name
- Supports PostgreSQL text search capabilities

### Indexing Strategy
- Primary keys on all tables for fast lookups
- Unique constraints on emails and attendance
- Foreign key relationships for data integrity
- Spatial indexes for location queries (can be added)

### Data Integrity
- Foreign key constraints maintain referential integrity
- Check constraints for data validation
- NOT NULL constraints for required fields
- Unique constraints prevent duplicates

## 🚀 Performance Considerations

### Recommended Indexes (for production)
```sql
-- Location-based queries
CREATE INDEX idx_meals_location ON meals USING GIST (location);
CREATE INDEX idx_hungry_location ON hungry USING GIST (location);

-- Common query patterns
CREATE INDEX idx_meals_host_id ON meals (host_id);
CREATE INDEX idx_attends_meal_id ON attends (meal_id);
CREATE INDEX idx_attends_user_id ON attends (user_id);
CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_chat_from_to ON chat (from_id, to_id);

-- Temporal queries
CREATE INDEX idx_meals_date ON meals (date);
CREATE INDEX idx_notifications_created_at ON notifications (created_at);
```

### Connection Pooling
The application uses `pg.Pool` for efficient database connection management.

### Prepared Statements
All queries use parameterized statements to prevent SQL injection and improve performance.

## 🔒 Security Features

### Authentication
- Passwords stored as bcrypt hashes with salt
- JWT tokens for session management
- OAuth integration for social login

### Authorization
- User-based access control
- Meal visibility controls
- Private messaging permissions

### Data Protection
- No sensitive data in logs
- Parameterized queries prevent SQL injection
- Input validation at application level

## 📈 Monitoring & Maintenance

### Health Checks
- Connection pool monitoring
- Query performance tracking
- Migration status verification

### Backup Strategy
- Regular database backups
- Point-in-time recovery capability
- Migration rollback procedures

### Performance Monitoring
- Slow query identification
- Index usage analysis
- Connection pool metrics