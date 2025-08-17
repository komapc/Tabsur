# 🍽️ **Tabsur - Food Sharing App - Complete User Experience Specification**

## **🚀 Deployment Status**
- **Status**: 🟢 **PRODUCTION LIVE**
- **URL**: https://bemyguest.dedyn.io
- **Last Updated**: August 17, 2025
- **Version**: 2.0.0

## **App Overview**
Tabsur is a social dining and food sharing application that connects people through shared meals. Users can create, discover, and join food events in their area, fostering community through culinary experiences.

## **Main Navigation Structure**
The app features a **swipeable interface** with 4 main tabs accessible via bottom navigation:

1. **Meals Tab** (Index 0) - **Public Access** (no login required)
2. **Profile Tab** (Index 1) - **Login Required**
3. **My Meals Tab** (Index 2) - **Login Required** 
4. **Chat Tab** (Index 3) - **Login Required**

## **Tab 1: Meals (Public Access)**
**Location**: First tab, accessible without authentication
**Purpose**: Discover and browse all available food sharing events

### **Dual View System**
**Top Navigation**: Two toggle buttons with icons and labels:
- **List View Button**: Shows list icon + "List" text
- **Map View Button**: Shows map icon + "Map" text

### **List View**
- **Layout**: Vertical scrollable list of meal cards
- **Each Meal Card Shows**:
  - Meal image (if available)
  - Host name and avatar
  - Meal title/description
  - Date and time
  - Location (address)
  - Current guest count vs. maximum capacity
  - Meal status indicators (available, full, hosted by user, attended by user)
  - Action buttons (Join, View Details, etc.)

### **Map View**
- **Google Maps Integration**: Full-screen interactive map
- **Meal Markers**: Custom icons for different meal types:
  - 🟢 **Available**: Green icon for open meals
  - 🔴 **Full**: Red icon for capacity-reached meals
  - 🟡 **Hosted**: Yellow icon for user's own meals
  - 🔵 **Attending**: Blue icon for meals user joined
- **Marker Interaction**: 
  - Tap marker to see meal preview
  - Bottom sheet slides up with meal details
  - Quick actions (Join, View Full Details)
- **Map Features**:
  - User's current location (blue dot)
  - Zoom controls
  - Map type toggle (roadmap/satellite)
  - "Find Me" button to center on user location

### **Authentication Gate**
- **List View**: Fully accessible, shows all meals
- **Map View**: Fully accessible, shows all meals
- **Interaction Attempts**: When user tries to join/attend a meal → redirects to login/register

## **Tab 2: Profile (Login Required)**
**Access**: Requires user authentication
**Purpose**: User profile management and personal information

### **Profile Content**
- **User Avatar**: Large circular profile picture (editable)
- **Basic Info**: Name, email, bio, location
- **Stats Display**: 
  - Meals hosted count
  - Meals attended count
  - Member since date
- **Edit Profile Button**: Opens profile editing form
- **Settings Access**: Link to app settings
- **Logout Button**: Secure logout with confirmation

## **Tab 3: My Meals (Login Required)**
**Access**: Requires user authentication  
**Purpose**: Manage meals created by the user

### **My Meals Content**
- **Hosted Meals List**: All meals created by the user
- **Meal Status Management**:
  - Active meals (upcoming)
  - Past meals (completed)
  - Cancelled meals
- **Quick Actions per Meal**:
  - Edit meal details
  - Cancel meal
  - View attendees list
  - Send notifications to guests
- **Create New Meal Button**: Prominent FAB (Floating Action Button) to start meal creation wizard

## **Tab 4: Chat (Login Required)**
**Access**: Requires user authentication
**Purpose**: Communication between meal hosts and attendees

### **Chat Features**
- **Conversations List**: All active chat threads
- **Chat Threads**: Organized by meal events
- **Real-time Messaging**: Instant message delivery
- **Push Notifications**: For new messages
- **Media Support**: Text, emojis, basic formatting
- **User Status**: Online/offline indicators

## **Authentication System**
### **Login Page**
- **Email/Password Fields**: Standard login form
- **Google OAuth**: "Sign in with Google 🚀" button
- **Error Handling**: Clear feedback for invalid credentials
- **Navigation**: Link to registration page

### **Registration Page**
- **User Details**: Name, email, password, confirm password
- **Validation**: Real-time form validation
- **Terms Acceptance**: Checkbox for terms and conditions
- **Success Flow**: Auto-login after successful registration

## **Meal Creation Wizard**
**Access**: Via FAB in My Meals tab
**Purpose**: Step-by-step meal creation process

### **Wizard Steps**
1. **Name & Description**: Meal title, detailed description
2. **Date & Time**: Pick date, start time, duration
3. **Location**: Address input with map picker
4. **Capacity**: Maximum number of guests
5. **Photos**: Upload meal images
6. **Review & Publish**: Final confirmation before going live

## **Meal Details Page**
**Access**: Tap any meal from list/map view
**Purpose**: Comprehensive meal information and actions

### **Content Sections**
- **Header**: Large meal image, title, host info
- **Details**: Date, time, location, description
- **Guest List**: Current attendees with avatars
- **Action Buttons**: Join/Leave, Contact Host, Share
- **Map Preview**: Small embedded map showing location
- **Reviews**: Past attendee feedback (if any)

## **Technical Implementation Details**
### **State Management**
- **Redux Store**: Centralized state for user, meals, chat
- **Real-time Updates**: WebSocket connections for live data
- **Offline Support**: Local storage for basic functionality

### **Navigation**
- **React Router**: Client-side routing with protected routes
- **Tab Switching**: Smooth transitions between main sections
- **Deep Linking**: Direct access to specific meals/users

### **UI Framework**
- **Material-UI**: Consistent design system
- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: User preference support
- **Accessibility**: Screen reader support, keyboard navigation

### **Performance Features**
- **Lazy Loading**: Images and components load on demand
- **Virtual Scrolling**: Efficient list rendering for large datasets
- **Image Optimization**: Compressed images with progressive loading
- **Caching**: Intelligent caching of meal data and user preferences

## **User Journey Examples**

### **New User Journey**
1. Opens app → sees Meals tab with list view
2. Browses available meals → finds interesting event
3. Tries to join → redirected to registration
4. Creates account → returns to meal details
5. Successfully joins meal → appears in My Meals tab

### **Host Journey**
1. Logged-in user → navigates to My Meals tab
2. Taps FAB → starts meal creation wizard
3. Fills out details → publishes meal
4. Meal appears in public list/map
5. Receives join requests → manages guest list
6. Uses chat to coordinate with attendees

## **File Structure Requirements**
```
src/
├── components/
│   ├── layout/
│   │   ├── Main.js              # Main tab switcher
│   │   ├── AppFab.js            # Floating action button
│   │   └── Bottom.js            # Bottom navigation
│   ├── meals/
│   │   ├── MealsListMapSwitcher.js  # List/Map toggle
│   │   ├── Meals.js             # List view component
│   │   ├── MealMap.js           # Map view component
│   │   ├── MealMapShow.js       # Google Maps integration
│   │   ├── MealListItem.js      # Individual meal card
│   │   └── CreateMeal/          # Meal creation wizard
│   ├── auth/
│   │   ├── Login.js             # Login form
│   │   ├── Register.js          # Registration form
│   │   └── PrivateRoute.js      # Protected route wrapper
│   ├── users/
│   │   ├── Profile.js           # User profile
│   │   ├── MyProfile.js         # Current user profile
│   │   └── Stats.js             # User statistics
│   └── chat/
│       └── ChatList.js          # Chat conversations
├── actions/                     # Redux actions
├── reducers/                    # Redux reducers
├── store/                       # Redux store configuration
└── utils/                       # Utility functions
```

## **Dependencies Required**
- **React**: ^18.3.1
- **React Router**: ^5.2.0
- **Redux**: ^4.0.1
- **Material-UI**: ^7.2.0
- **Google Maps API**: @react-google-maps/api
- **Google OAuth**: @react-oauth/google
- **Firebase**: ^12.0.0 (for notifications)
- **JWT**: jwt-decode for authentication

## **API Endpoints Required**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/meals` - Fetch all meals
- `POST /api/meals` - Create new meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal
- `POST /api/meals/:id/join` - Join meal
- `POST /api/meals/:id/leave` - Leave meal
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/chat/:mealId` - Get chat messages
- `POST /api/chat/:mealId` - Send message

This specification provides the complete framework needed to recreate the Tabsur food sharing app from scratch, covering all major features, user flows, technical requirements, and implementation details.
