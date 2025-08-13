import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Toolbar,
  Grid,
  Button,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from "@mui/material";
import {
  Person,
  Email,
  LocationOn,
  Notifications,
  Security,
  Logout,
  Save,
  Edit,
  Cancel,
  PhotoCamera,
  Settings as SettingsIcon,
  Language,
  DarkMode,
  VolumeUp,
  Visibility
} from "@mui/icons-material";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { 
  updateUserProfile, 
  updateUserPreferences, 
  getUserPreferences,
  changePassword,
  deactivateAccount,
  deleteAccount
} from "../../actions/userActions";
import store from "../../store";
import { useHistory } from "react-router-dom";
import BackBarMui from "../layout/BackBarMui";
import setAuthToken, { checkAuthState, cleanupToken } from "../../utils/setAuthToken";

const Settings = ({ auth, errors }) => {
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    location: ""
  });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    locationSharing: true,
    darkMode: false,
    soundEnabled: true,
    profileVisibility: "public"
  });

  // Initialize form data from auth state and load preferences
  useEffect(() => {
    if (auth.user && auth.user.id) {
      setFormData({
        name: auth.user.name || "",
        email: auth.user.email || "",
        address: auth.user.address || "",
        location: auth.user.location || ""
      });
      
      // Load user preferences
      loadUserPreferences();
    }
  }, [auth.user]);

  const loadUserPreferences = async () => {
    try {
      const response = await getUserPreferences(auth.user.id);
      if (response.data) {
        setPreferences(prev => ({
          ...prev,
          ...response.data
        }));
      }
    } catch (error) {
      console.log("Could not load user preferences:", error);
      // Use default preferences if loading fails
    }
  };

  const handleLogout = () => {
    store.dispatch(logoutUser());
    history.push("/login");
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handlePreferenceChange = (preference) => (event) => {
    setPreferences({
      ...preferences,
      [preference]: event.target.checked || event.target.value
    });
  };

  const handleSave = async () => {
    if (!auth.user?.id) return;
    
    setIsLoading(true);
    try {
      // Update user profile
      await updateUserProfile(auth.user.id, formData);
      
      // Update user preferences
      await updateUserPreferences(auth.user.id, preferences);
      
      setIsEditing(false);
      setShowSuccess(true);
      
    } catch (error) {
      console.error("Failed to save settings:", error);
      setErrorMessage(error.response?.data?.message || "Failed to save changes. Please try again.");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (auth.user && auth.user.id) {
      setFormData({
        name: auth.user.name || "",
        email: auth.user.email || "",
        address: auth.user.address || "",
        location: auth.user.location || ""
      });
    }
    setIsEditing(false);
  };

  const handleCloseSnackbar = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  const handleChangePassword = () => {
    // For now, show a simple prompt. In a real app, you'd have a modal or separate page
    const newPassword = prompt("Enter new password:");
    if (newPassword && newPassword.length >= 6) {
      handlePasswordChange(newPassword);
    } else if (newPassword !== null) {
      alert("Password must be at least 6 characters long");
    }
  };

  const handlePasswordChange = async (newPassword) => {
    if (!auth.user?.id) return;
    
    setIsLoading(true);
    try {
      await changePassword(auth.user.id, { newPassword });
      setShowSuccess(true);
      setErrorMessage("Password changed successfully!");
    } catch (error) {
      console.error("Failed to change password:", error);
      setErrorMessage(error.response?.data?.message || "Failed to change password");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacySettings = () => {
    // Toggle location sharing preference
    setPreferences(prev => ({
      ...prev,
      locationSharing: !prev.locationSharing
    }));
    setShowSuccess(true);
    setErrorMessage("Privacy settings updated!");
  };

  const handleDataExport = () => {
    // Create a simple data export
    const userData = {
      profile: formData,
      preferences: preferences,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-data-${auth.user?.id || 'export'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    setShowSuccess(true);
    setErrorMessage("Data exported successfully!");
  };

  const handleDeactivateAccount = async () => {
    if (!auth.user?.id) return;
    
    if (!window.confirm("Are you sure you want to deactivate your account? You can reactivate it later by logging in.")) {
      return;
    }
    
    setIsLoading(true);
    try {
      await deactivateAccount(auth.user.id);
      setShowSuccess(true);
      setErrorMessage("Account deactivated successfully!");
      // Logout after deactivation
      setTimeout(() => {
        handleLogout();
      }, 2000);
    } catch (error) {
      console.error("Failed to deactivate account:", error);
      setErrorMessage(error.response?.data?.message || "Failed to deactivate account");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.user?.id) return;
    
    if (!window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      return;
    }
    
    setIsLoading(true);
    try {
      await deleteAccount(auth.user.id);
      setShowSuccess(true);
      setErrorMessage("Account deleted successfully!");
      // Logout after deletion
      setTimeout(() => {
        handleLogout();
      }, 2000);
    } catch (error) {
      console.error("Failed to delete account:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete account");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Please log in to access settings</Typography>
        <Button 
          variant="contained" 
          onClick={() => history.push("/login")}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Toolbar>
        <BackBarMui history={history} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Settings
        </Typography>
      </Toolbar>

      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        {/* Profile Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ width: 80, height: 80, mr: 2 }}
                src={auth.user?.fb_picture}
              >
                {auth.user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  Profile Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your personal information and profile
                </Typography>
              </Box>
              <IconButton 
                color="primary" 
                onClick={() => setIsEditing(!isEditing)}
                sx={{ mr: 1 }}
              >
                {isEditing ? <Cancel /> : <Edit />}
              </IconButton>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={!isEditing}
                  type="email"
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  disabled={!isEditing}
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSave}
                  startIcon={<Save />}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SettingsIcon sx={{ mr: 1 }} />
              Preferences
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText 
                  primary="Email Notifications"
                  secondary="Receive email updates about meals and activities"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={preferences.emailNotifications}
                    onChange={handlePreferenceChange('emailNotifications')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText 
                  primary="Push Notifications"
                  secondary="Receive push notifications on your device"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={preferences.pushNotifications}
                    onChange={handlePreferenceChange('pushNotifications')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText 
                  primary="Location Sharing"
                  secondary="Allow other users to see your general location"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={preferences.locationSharing}
                    onChange={handlePreferenceChange('locationSharing')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemIcon>
                  <DarkMode />
                </ListItemIcon>
                <ListItemText 
                  primary="Dark Mode"
                  secondary="Use dark theme for the application"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={preferences.darkMode}
                    onChange={handlePreferenceChange('darkMode')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemIcon>
                  <VolumeUp />
                </ListItemIcon>
                <ListItemText 
                  primary="Sound Effects"
                  secondary="Play sounds for notifications and interactions"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={preferences.soundEnabled}
                    onChange={handlePreferenceChange('soundEnabled')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemIcon>
                  <Visibility />
                </ListItemIcon>
                <ListItemText 
                  primary="Profile Visibility"
                  secondary="Control who can see your profile information"
                />
                <ListItemSecondaryAction>
                  <TextField
                    select
                    value={preferences.profileVisibility}
                    onChange={handlePreferenceChange('profileVisibility')}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </TextField>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Account Actions Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ mr: 1 }} />
              Account & Security
            </Typography>
            
            <List>
              <ListItem button onClick={() => handleChangePassword()}>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText 
                  primary="Change Password"
                  secondary="Update your account password"
                />
              </ListItem>
              
              <Divider />
              
              <ListItem button onClick={() => handlePrivacySettings()}>
                <ListItemIcon>
                  <Visibility />
                </ListItemIcon>
                <ListItemText 
                  primary="Privacy Settings"
                  secondary="Manage your privacy and data sharing preferences"
                />
              </ListItem>
              
              <Divider />
              
              <ListItem button onClick={() => handleDataExport()}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Data Export"
                  secondary="Download your personal data"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Debug Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SettingsIcon sx={{ mr: 1 }} />
              Debug & Testing
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                color="info"
                onClick={() => {
                  const authState = checkAuthState();
                  console.log("🔍 Manual Auth Check:", authState);
                }}
              >
                Check Auth State
              </Button>
              <Button 
                variant="outlined" 
                color="info"
                onClick={() => {
                  console.log("🔍 Redux Auth State:", auth);
                  console.log("🔍 Local Storage Token:", localStorage.getItem("jwtToken"));
                }}
              >
                Check Redux State
              </Button>
              <Button 
                variant="outlined" 
                color="info"
                onClick={async () => {
                  try {
                    // Test a simple authenticated API call
                    const response = await fetch('http://localhost:5000/api/users/system', {
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
                      }
                    });
                    console.log("🔍 Test API Response:", response.status, response.statusText);
                    if (response.ok) {
                      const data = await response.json();
                      console.log("🔍 Test API Data:", data);
                    }
                  } catch (error) {
                    console.error("🔍 Test API Error:", error);
                  }
                }}
              >
                Test API Call
              </Button>
              <Button 
                variant="outlined" 
                color="success"
                onClick={async () => {
                  try {
                    // Test with axios to see if there's a difference
                    const token = localStorage.getItem("jwtToken");
                    console.log("🔍 Testing with axios, token:", token ? `${token.substring(0, 30)}...` : 'None');
                    
                    // Import axios dynamically
                    const { default: axios } = await import('axios');
                    const response = await axios.get('http://localhost:5000/api/users/system', {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });
                    console.log("🔍 Axios Test Response:", response.status, response.data);
                  } catch (error) {
                    console.error("🔍 Axios Test Error:", error.response?.status, error.response?.data);
                  }
                }}
              >
                Test with Axios
              </Button>
              <Button 
                variant="outlined" 
                color="info"
                onClick={async () => {
                  try {
                    // Test the failing endpoints to see what's happening
                    const token = localStorage.getItem("jwtToken");
                    console.log("🔍 Testing failing endpoints with token:", token ? `${token.substring(0, 30)}...` : 'None');
                    
                    const endpoints = [
                      'http://localhost:5000/api/meals/my/3',
                      'http://localhost:5000/api/meals/attends/3',
                      'http://localhost:5000/api/chat/3'
                    ];
                    
                    for (const endpoint of endpoints) {
                      try {
                        const response = await fetch(endpoint, {
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        });
                        console.log(`🔍 ${endpoint}: ${response.status} ${response.statusText}`);
                        if (response.status === 403) {
                          const errorData = await response.text();
                          console.log(`🔍 403 Error details:`, errorData);
                        }
                      } catch (error) {
                        console.error(`🔍 Error testing ${endpoint}:`, error);
                      }
                    }
                  } catch (error) {
                    console.error("🔍 Test Failing Endpoints Error:", error);
                  }
                }}
              >
                Test Failing Endpoints
              </Button>
              <Button 
                variant="outlined" 
                color="warning"
                onClick={() => {
                  const cleanedToken = cleanupToken();
                  if (cleanedToken) {
                    setAuthToken(cleanedToken);
                    console.log("🧹 Token cleaned and reset");
                  }
                }}
              >
                Clean Token
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Logout Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Logout sx={{ mr: 1 }} />
              Account Actions
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                color="warning"
                onClick={() => handleDeactivateAccount()}
                disabled={isLoading}
              >
                Deactivate Account
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => handleDeleteAccount()}
                disabled={isLoading}
              >
                Delete Account
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{ ml: 'auto' }}
                disabled={isLoading}
              >
                Logout
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Settings saved successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

Settings.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(Settings);
