# MyApp - ChatMe Live Application

## Overview

MyApp is a real-time social audio/video streaming application built with React Native and Expo. The application enables users to host live audio rooms, join party rooms, send gifts, play games, and interact through chat. It features VIP memberships, Agora-powered voice communication, and a comprehensive social experience similar to platforms like Clubhouse or Yalla.

The project consists of two main parts:
- **Frontend**: React Native mobile application (Expo-based)
- **Backend**: Express.js REST API with PostgreSQL database

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Platform**
- Built with React Native 0.81.5 and Expo SDK 54
- Uses Expo's managed workflow with development client enabled
- Supports Android (primary), iOS, and Web (limited support)
- React 19.1.0 with new architecture enabled

**Navigation Structure**
- React Navigation v7 with multiple navigation patterns:
  - Native Stack Navigator for main app flow
  - Tab View for swipeable home sections
  - Bottom Tabs for main navigation (Home, Party, Live, Chat, Profile)
- Navigation hierarchy:
  - `AppNavigator`: Root navigator handling authentication state
  - `AuthNavigator`: Login/registration flow
  - `MainTabsNavigator`: Main app tabs with custom tab bar
  - `LiveNavigator`: Live streaming host screens
  - `RoomNavigator`: Party room experience
  - `ProfileNavigator`: User profile and settings

**State Management**
- Context API for global state (LiveContext for managing active live streams)
- Local component state with React hooks
- AsyncStorage for persistent data (authentication tokens, user preferences)

**UI/UX Design Patterns**
- Dark theme with pastel accent colors (purple, pink, mint green)
- Extensive use of animations via React Native Animated API
- Modal-based interactions for gifts, games, settings
- Lottie animations for emojis, VIP effects, and entry animations
- Custom components with auto-generated index exports
- Responsive scaling using `react-native-size-matters`

**Key Features Implementation**

*Audio Room System*
- Party rooms with configurable seat layouts (12-seat default)
- Seat management (lock/unlock, mute, kick users)
- Real-time speaking indicators with glow effects
- Chat overlay with tabs (All/System messages)
- Gift system with animations and coin tracking

*Live Streaming*
- Host controls for starting/stopping broadcasts
- Integration with Agora SDK for voice communication
- Channel-based room management
- User join effects with VIP-tiered animations (motorcycle entry with banner)

*Social Features*
- Gift sending with quantity selection and multi-user targeting
- Emoji reactions with Lottie animations
- User profiles with levels, VIP status, avatar frames
- Game integration via WebView modals
- Music player with volume controls

*Authentication*
- Phone number + password authentication
- Google OAuth integration (Expo AuthSession)
- JWT token-based session management

### Backend Architecture

**Technology Stack**
- Express.js 4.x REST API
- PostgreSQL database via node-postgres (pg)
- ES Modules (type: "module")
- JWT for authentication
- bcryptjs for password hashing

**Database Schema**
- PostgreSQL hosted on Neon (cloud PostgreSQL)
- Connection pooling with SSL enabled
- Tables created on initialization:
  - `users`: Stores user accounts (id, phone, password, name, timestamps)
  - Auto-increment primary keys
  - Unique constraint on phone numbers

**API Architecture**
- RESTful endpoints for user authentication
- CORS enabled for cross-origin requests
- JSON request/response format
- Environment-based configuration via dotenv
- Database initialization on server start

**Authentication Flow**
- Password hashing with bcrypt (10 salt rounds)
- JWT token generation on login
- Token-based authorization (JWT secret from environment)
- Phone number as unique identifier

**Deployment Considerations**
- Designed for Replit deployment
- Environment variable handling for DATABASE_URL
- Automatic table creation on first run
- Connection error handling with process exit on failure

## External Dependencies

### Backend Services

**NeonDB (PostgreSQL)**
- Cloud-hosted PostgreSQL database
- SSL connection required
- Environment variable: `DATABASE_URL`
- Used for user authentication and data persistence

**Google OAuth**
- Google Sign-In via Expo AuthSession
- Web Client ID required for Expo Go
- Scopes: openid, profile, email
- Token-based authentication flow

**Agora RTC**
- Real-time voice communication SDK
- App ID: Configured in `src/config/Agora.js`
- Channel-based room system
- Used for party room audio streaming

### Third-Party Libraries & SDKs

**Core Framework**
- `expo` (v54): Development platform and SDK
- `react-native` (v0.81.5): Mobile framework
- `react` (v19.1.0): UI library
- `react-native-agora` (v4.5.3): Voice streaming

**Navigation**
- `@react-navigation/native` (v7): Navigation framework
- `@react-navigation/native-stack`: Stack navigation
- `@react-navigation/bottom-tabs`: Tab navigation
- `@react-navigation/material-top-tabs`: Swipeable tabs
- `react-native-tab-view`: Custom tab implementation

**UI Components & Animation**
- `lottie-react-native` (v7.3.1): JSON animations
- `react-native-linear-gradient`: Gradient backgrounds
- `expo-blur`: Blur effects
- `react-native-shimmer-placeholder`: Loading skeletons
- `@expo/vector-icons`: Icon library
- `react-native-svg`: SVG support

**Media & File Handling**
- `expo-image-picker`: Image selection
- `expo-document-picker`: File selection
- `react-native-webview`: In-app browser for games
- `@react-native-community/slider`: Custom sliders

**Storage & Authentication**
- `@react-native-async-storage/async-storage`: Local storage
- `expo-auth-session`: OAuth flows
- `expo-web-browser`: External browser integration
- `jsonwebtoken`: JWT handling (backend)
- `bcryptjs`: Password hashing (backend)

**Utilities**
- `react-native-size-matters`: Responsive scaling
- `expo-constants`: App configuration
- `expo-random`: Random ID generation
- `react-native-modal-datetime-picker`: Date/time selection
- `concurrently`: Running multiple processes

**Development Tools**
- `nodemon`: Backend hot reload
- `expo-dev-client`: Custom development builds
- `@expo/ngrok`: Tunneling for development

### Assets & Resources

**Local Assets**
- Lottie JSON files for emojis and effects
- VIP level badges and avatar frames
- Gift images (static and animated)
- Game icons and thumbnails
- Icon sets for UI elements

**External Resources**
- Picsum Photos API: Placeholder user avatars
- Custom hosted banners and promotional images