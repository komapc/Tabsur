import React, { Component } from "react";
import { withRouter, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { getUserInfo } from "../../actions/userActions";
import Avatar from "../layout/Avatar";
import Gallery from "../../components/users/Gallery";
import { Friends } from "../../components/users/Friends";
import MyMeals from "../../components/meals/MyMeals";
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
//#region MyProfileHeader
const useStylesHeader = makeStyles(theme => ({
  alignItemsAndJustifyContent: {
    width: "100vw",
    marginTop: "64px",
    height: theme?.spacing ? theme.spacing(5) : '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
  }
}));
const MyProfileHeader = (props) => {
  const classes = useStylesHeader();
  const openSettings = (history) => {
    history.push('/settings');
  };

  const history = useHistory();
  return <>
    <h3 style={{ textAlign: "center", width: "90vw" }}>Profile </h3>
    <IconButton color="primary" aria-label="settings"
      style={{ position: "absolute", top: "10px", paddingLeft: "90vw" }}
      onClick={() => openSettings(history)}
    >
      <SettingsIcon style={{ color: "#000000" }} />
    </IconButton>

    <div className={classes.alignItemsAndJustifyContent}>
      <Avatar class="large" user={props.user} />
    </div>
  </>
}
//#endregion


//#region MyProfileStats
const useStylesStats = makeStyles(theme => ({
  headerContainer: {
    width: "100vw",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    //color: "#13A049",
    fontSize: 28,
    fontWeight: "fontWeightBold",
    fontStyle: "bold",
    //fontFamily: "Monospace"
    //margin: '20px'
  },
  stat: {
    //color: "#13A049",
    fontSize: 16,
    fontWeight: "fontWeightBold",
    alignItems: 'left',
    justifyContent: 'left',
    display: 'flex',
    paddingLeft: '30%'
  }
}))

const MyProfileStats = (params) => {
  const classes = useStylesStats();
  const userStats = (params.userStats && params.userStats[0]) ? params.userStats[0] : {};

  try {
    return <React.Fragment>
    {/* {userStats?<div>{ JSON.stringify(userStats)}</div>:<span/>} */}
    <div className={classes.headerContainer}>
      <h5 className={classes.header}>{params.name}</h5>
    </div>
    <div className={classes.headerContainer}>
      <Grid container spacing={2}>
        <Grid xs={6}><span className={classes.stat}>Followers {userStats.followers || 0}</span></Grid>
        <Grid xs={6}><span className={classes.stat}>Active meals {userStats.active_meals || 0}</span></Grid>
        <Grid xs={6}><span className={classes.stat}>Following {userStats.following || 0}</span></Grid>
        <Grid xs={6}><span className={classes.stat}>Meals Created {userStats.meals_created || 0}</span></Grid>
      </Grid>
    </div>
  </React.Fragment>
  } catch (error) {
    console.error('MyProfileStats error:', error);
    return <div>Profile stats temporarily unavailable</div>;
  }
}
//#endregion

//#region MyProfileTabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}
const useStylesTabs = makeStyles(theme => ({
  root: {
    flexGrow: 1, // ?

    color: "black",
    fontSize: 16,
    fontWeight: "fontWeightBold",
    width: "100vw",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }
}));
const MyProfileTabs = (props) => {
  console.log(`MyProfileTabs props: ${JSON.stringify(props)}`);
  const classes = useStylesTabs();
  // const handleLogout = (event) => {
  //   store.dispatch(logoutUser());
  // }

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  try {
    return (
    <React.Fragment>
      <Box className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          indicatorColor='primary'
          TabIndicatorProps={{ style: { backgroundColor: "primary" } }}
        >
          <Tab label="Friends" {...a11yProps(0)} />
          <Tab label="Gallery" {...a11yProps(1)} />
          {/* <Tab label="My Meals" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} >
        <Friends id={props.id} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Gallery id={props.id} />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <MyMeals />
      </TabPanel>
    </React.Fragment>
  )
  } catch (error) {
    console.error('MyProfileTabs error:', error);
    return <div>Profile tabs temporarily unavailable</div>;
  }
}
//#endregion

class MyProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.auth.user?.name || '',
      userId: this.props.auth.user?.id || null,
      email: this.props.auth.user?.email || '',
      address: "",
      errors: {},
      userStats: null
    };
  }

  componentDidMount() {
    if (this.state.userId && !isNaN(this.state.userId)) {
      this.loadUserInfo();
    }
  }

  componentDidUpdate(prevProps) {
    // Check if user ID changed (e.g., after login)
    if (prevProps.auth.user?.id !== this.props.auth.user?.id && this.props.auth.user?.id) {
      this.setState({
        userId: this.props.auth.user.id,
        name: this.props.auth.user.name || '',
        email: this.props.auth.user.email || ''
      }, () => {
        if (this.state.userId && !isNaN(this.state.userId)) {
          this.loadUserInfo();
        }
      });
    }

    // Handle errors
    if (prevProps.errors !== this.props.errors && this.props.errors) {
      this.setState({
        errors: this.props.errors
      });
    }

    // Handle active state
    if (prevProps.active !== this.props.active && this.props.active) {
      this.props.setFabVisibility(true);
      this.props.setSwipability(true);
    }
  }

  loadUserInfo = () => {
    if (!this.state.userId || isNaN(this.state.userId)) {
      console.log('Cannot load user info: invalid user ID');
      return;
    }

    console.log(`Loading user info for ID: ${this.state.userId}`);
    getUserInfo(this.state.userId)
      .then(res => {
        console.log('User info loaded:', res.data);
        this.setState({
          userStats: res.data
        });
      })
      .catch(err => {
        console.error('Failed to load user info:', err);
      });
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      address: this.state.address,
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    console.log('MyProfile render - auth state:', {
      isAuthenticated: this.props.auth.isAuthenticated,
      userId: this.state.userId,
      authUser: this.props.auth.user
    });

    // Don't render if user is not authenticated
    if (!this.props.auth.isAuthenticated || !this.state.userId) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Please log in to view your profile</p>
          <p>Authentication status: {this.props.auth.isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
          <p>User ID: {this.state.userId || 'Not available'}</p>
        </div>
      );
    }

    return (
      <React.Fragment>
        <MyProfileHeader user={{ id: this.state.userId, name: this.state.name }} />
        <MyProfileStats name={this.state.name} userStats={this.state.userStats} />
        <MyProfileTabs id={this.state.userId} />
      </React.Fragment>
    );
  }
}

MyProfile.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(MyProfile));
