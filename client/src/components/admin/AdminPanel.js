import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import config from "../../config";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      users: [],
      meals: [],
      stats: {},
      loading: {
        users: false,
        meals: false,
        stats: false
      },
      error: null,
      success: null,
      editDialog: {
        open: false,
        type: null,
        data: null
      }
    };
  }

  componentDidMount() {
    this.loadDashboardData();
  }

  loadDashboardData = async () => {
    await Promise.all([
      this.loadUsers(),
      this.loadMeals(),
      this.loadStats()
    ]);
  };

  loadUsers = async () => {
    this.setState(prev => ({ loading: { ...prev.loading, users: true } }));
    try {
      const response = await axios.get(`${config.SERVER_HOST}/api/admin/users`);
      this.setState({ users: response.data, error: null });
    } catch (error) {
      console.error('Error loading users:', error);
      this.setState({ error: 'Failed to load users' });
    } finally {
      this.setState(prev => ({ loading: { ...prev.loading, users: false } }));
    }
  };

  loadMeals = async () => {
    this.setState(prev => ({ loading: { ...prev.loading, meals: true } }));
    try {
      const response = await axios.get(`${config.SERVER_HOST}/api/admin/meals`);
      this.setState({ meals: response.data, error: null });
    } catch (error) {
      console.error('Error loading meals:', error);
      this.setState({ error: 'Failed to load meals' });
    } finally {
      this.setState(prev => ({ loading: { ...prev.loading, meals: false } }));
    }
  };

  loadStats = async () => {
    this.setState(prev => ({ loading: { ...prev.loading, stats: true } }));
    try {
      const response = await axios.get(`${config.SERVER_HOST}/api/admin/stats`);
      this.setState({ stats: response.data, error: null });
    } catch (error) {
      console.error('Error loading stats:', error);
      this.setState({ error: 'Failed to load statistics' });
    } finally {
      this.setState(prev => ({ loading: { ...prev.loading, stats: false } }));
    }
  };

  handleTabChange = (event, newValue) => {
    this.setState({ activeTab: newValue });
  };

  openEditDialog = (type, data) => {
    this.setState({
      editDialog: {
        open: true,
        type,
        data: { ...data }
      }
    });
  };

  closeEditDialog = () => {
    this.setState({
      editDialog: {
        open: false,
        type: null,
        data: null
      }
    });
  };

  handleEdit = async () => {
    const { type, data } = this.state.editDialog;
    try {
      if (type === 'user') {
        await axios.put(`${config.SERVER_HOST}/api/admin/users/${data.id}`, data);
        this.setState({ success: 'User updated successfully' });
      } else if (type === 'meal') {
        await axios.put(`${config.SERVER_HOST}/api/admin/meals/${data.id}`, data);
        this.setState({ success: 'Meal updated successfully' });
      }
      this.closeEditDialog();
      this.loadDashboardData();
    } catch (error) {
      console.error('Error updating:', error);
      this.setState({ error: 'Failed to update' });
    }
  };

  handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      if (type === 'user') {
        await axios.delete(`${config.SERVER_HOST}/api/admin/users/${id}`);
        this.setState({ success: 'User deleted successfully' });
      } else if (type === 'meal') {
        await axios.delete(`${config.SERVER_HOST}/api/admin/meals/${id}`);
        this.setState({ success: 'Meal deleted successfully' });
      }
      this.loadDashboardData();
    } catch (error) {
      console.error('Error deleting:', error);
      this.setState({ error: 'Failed to delete' });
    }
  };

  renderDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h4">
              {this.state.stats.totalUsers || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Meals
            </Typography>
            <Typography variant="h4">
              {this.state.stats.totalMeals || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Sessions
            </Typography>
            <Typography variant="h4">
              {this.state.stats.activeSessions || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  renderUsers = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={this.loadUsers}
          disabled={this.state.loading.users}
        >
          Refresh
        </Button>
      </Box>
      
      {this.state.loading.users ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Followers</TableCell>
                <TableCell>Following</TableCell>
                <TableCell>Meals Hosted</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.location || 'N/A'}</TableCell>
                  <TableCell>{user.followers || 0}</TableCell>
                  <TableCell>{user.following || 0}</TableCell>
                  <TableCell>{user.meals_hosted || 0}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => this.openEditDialog('user', user)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit User">
                      <IconButton onClick={() => this.openEditDialog('user', user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton 
                        color="error"
                        onClick={() => this.handleDelete('user', user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  renderMeals = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Meal Management</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={this.loadMeals}
          disabled={this.state.loading.meals}
        >
          Refresh
        </Button>
      </Box>
      
      {this.state.loading.meals ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Host</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Attendees</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.meals.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell>{meal.id}</TableCell>
                  <TableCell>{meal.title}</TableCell>
                  <TableCell>{meal.host_name}</TableCell>
                  <TableCell>{new Date(meal.date).toLocaleDateString()}</TableCell>
                  <TableCell>{meal.location}</TableCell>
                  <TableCell>{meal.attendees_count || 0}</TableCell>
                  <TableCell>
                    <Chip 
                      label={meal.status || 'Active'} 
                      color={meal.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => this.openEditDialog('meal', meal)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Meal">
                      <IconButton onClick={() => this.openEditDialog('meal', meal)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Meal">
                      <IconButton 
                        color="error"
                        onClick={() => this.handleDelete('meal', meal.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  renderSecurity = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Security Overview</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                HTTPS Status
              </Typography>
              <Chip 
                label="Enabled" 
                color="success" 
                icon={<SecurityIcon />}
                sx={{ mt: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                All communications are encrypted using TLS 1.3
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Authentication
              </Typography>
              <Chip 
                label="JWT" 
                color="info" 
                sx={{ mt: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Secure token-based authentication system
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  render() {
    const { activeTab, editDialog, error, success } = this.state;

    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          🛡️ Admin Panel
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => this.setState({ error: null })}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => this.setState({ success: null })}>
            {success}
          </Alert>
        )}

        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={this.handleTabChange}
            aria-label="admin tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Dashboard" 
              iconPosition="start"
            />
            <Tab 
              icon={<PeopleIcon />} 
              label="Users" 
              iconPosition="start"
            />
            <Tab 
              icon={<RestaurantIcon />} 
              label="Meals" 
              iconPosition="start"
            />
            <Tab 
              icon={<SecurityIcon />} 
              label="Security" 
              iconPosition="start"
            />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            {this.renderDashboard()}
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            {this.renderUsers()}
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            {this.renderMeals()}
          </TabPanel>
          
          <TabPanel value={activeTab} index={3}>
            {this.renderSecurity()}
          </TabPanel>
        </Paper>

        {/* Edit Dialog */}
        <Dialog open={editDialog.open} onClose={this.closeEditDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            Edit {editDialog.type === 'user' ? 'User' : 'Meal'}
          </DialogTitle>
          <DialogContent>
            {editDialog.data && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {editDialog.type === 'user' ? (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={editDialog.data.name || ''}
                        onChange={(e) => this.setState(prev => ({
                          editDialog: {
                            ...prev.editDialog,
                            data: { ...prev.editDialog.data, name: e.target.value }
                          }
                        }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={editDialog.data.email || ''}
                        onChange={(e) => this.setState(prev => ({
                          editDialog: {
                            ...prev.editDialog,
                            data: { ...prev.editDialog.data, email: e.target.value }
                          }
                        }))}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={editDialog.data.title || ''}
                        onChange={(e) => this.setState(prev => ({
                          editDialog: {
                            ...prev.editDialog,
                            data: { ...prev.editDialog.data, title: e.target.value }
                          }
                        }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={editDialog.data.location || ''}
                        onChange={(e) => this.setState(prev => ({
                          editDialog: {
                            ...prev.editDialog,
                            data: { ...prev.editDialog.data, location: e.target.value }
                          }
                        }))}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeEditDialog}>Cancel</Button>
            <Button onClick={this.handleEdit} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AdminPanel);
