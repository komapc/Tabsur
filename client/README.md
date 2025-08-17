# Tabsur Client - React Frontend

This is the React frontend for the Tabsur social meal planning application, built with modern React 18 and Material-UI v7.

## 🚀 Tech Stack

- **React 18.3.1** - Latest React with modern features
- **Material-UI v7.2.0** - Latest Material Design components
- **Redux 7.2.1** - State management with Redux Thunk
- **React Router 5.2.0** - Client-side routing
- **Google Maps API** - Location services and geolocation
- **Firebase 12.0.0** - Push notifications and cloud services

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── about/          # About page components
│   ├── admin/          # Admin panel components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat functionality
│   ├── common/         # Shared/common components
│   ├── layout/         # Layout and navigation
│   ├── meals/          # Meal-related components
│   ├── notifications/  # Notification components
│   ├── private-route/  # Route protection
│   └── users/          # User profile components
├── actions/            # Redux actions
├── reducers/           # Redux reducers
├── config.js           # Frontend configuration
└── index.js            # Application entry point
```

## 🚀 Available Scripts

### Development
```bash
# Start development server
npm start

# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Production
```bash
# Build for production
npm run build

# Stop development server
npm run stop
```

## 🔧 Key Features

- **User Authentication** - JWT-based login/registration with Google OAuth
- **Meal Creation** - Multi-step wizard for creating meals
- **Location Services** - Google Maps integration for meal locations
- **Social Features** - Follow users, attend meals, chat functionality
- **Real-time Updates** - Push notifications via Firebase
- **Responsive Design** - Mobile-first UI with Material-UI v7
- **Admin Panel** - User and meal management dashboard

## 🧪 Testing

```bash
# Run tests with coverage
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/components/auth/Login.test.js
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Client-side form validation
- **XSS Protection** - Content sanitization
- **CORS Handling** - Secure cross-origin requests

## 📱 Responsive Design

- **Mobile-First** - Optimized for mobile devices
- **Progressive Web App** - Offline capabilities
- **Touch-Friendly** - Optimized touch interactions
- **Cross-Browser** - Compatible with modern browsers

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🔧 Configuration

### Environment Variables
```bash
REACT_APP_SERVER_HOST=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key
REACT_APP_FIREBASE_CONFIG='{"apiKey":"...","authDomain":"..."}'
```

### Google Maps Setup
See [GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md) for detailed setup instructions.

## 🚀 Performance Features

- **Code Splitting** - Lazy loading of components
- **Bundle Optimization** - Optimized production builds
- **Image Optimization** - Compressed and optimized images
- **Caching** - Browser caching strategies

## 🔄 Recent Updates

- **August 2025**: Material-UI v7 upgrade
- **August 2025**: React 18 compatibility improvements
- **August 2025**: Performance optimizations
- **August 2025**: Security enhancements

## 📚 Learn More

- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Documentation](https://redux.js.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/)

## 🆘 Support

For issues or questions:
1. Check the main [README.md](../README.md)
2. Review existing issues
3. Create a new issue with detailed information

---

**Current Status**: Production deployed and running with version 2.0.0, featuring Material-UI v7 and React 18 optimizations.
