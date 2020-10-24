import React, { Component } from "react";
import { withRouter, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser, getUser } from "../../actions/authActions";
import Avatar from "../layout/Avatar"
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Gallery from "../../components/users/Gallery"
import Friends from "../../components/users/Friends"
import MyMeals from "../../components/meals/MyMeals"
import { IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
//#region MyProfileHeader
const useStylesHeader = makeStyles(theme => ({
  alignItemsAndJustifyContent: {
    width: "100%",
    marginTop: "64px",
    height: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
  }
}))
const MyProfileHeader = (props) => {
  const classes = useStylesHeader();
  const openSettings = (history) => {
    history.push('/settings')
  }

  const history = useHistory();
  return <React.Fragment>

    <h3 style={{ textAlign: "center", width: "90%" }}>Profile
        </h3>
    <IconButton color="primary" aria-label="settings"
      style={{ position: "fixed", top: "10px", paddingLeft: "90%" }}
      onClick={() => openSettings(history)}
    >
      <SettingsIcon style={{color:"#000000"}} />
    </IconButton>

    <div className={classes.alignItemsAndJustifyContent}>
      <Avatar class="large" user={props.user}/>
    </div>
  </React.Fragment>
}
//#endregion


//#region MyProfileStats
const useStylesStats = makeStyles(theme => ({
  headerContainer: {
    width: "100%",
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

  return <React.Fragment>
    {/* {userStats?<div>{ JSON.stringify(userStats)}</div>:<span/>} */}
    <div className={classes.headerContainer}>
      <h5 className={classes.header}>{params.name}</h5>
    </div>
    <div className={classes.headerContainer}>
      <Grid container >
        <Grid item xs={6}><span className={classes.stat}>Followers {userStats.followers}</span></Grid>
        <Grid item xs={6}><span className={classes.stat}>Active meals {userStats.active_meals}</span></Grid>
        <Grid item xs={6}><span className={classes.stat}>Following {userStats.following}</span></Grid>
        <Grid item xs={6}><span className={classes.stat}>Meals Created {userStats.meals_created}</span></Grid>
      </Grid>
    </div>
  </React.Fragment>

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
    width: "100%",
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
}
//#endregion

class MyProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.auth.user.name,
      userId: this.props.auth.user.id,
      email: this.props.auth.user.email,
      address: "",
      errors: {}
    };
    console.log(`user id: ${JSON.stringify(this.state.userId)}`);
    getUser(this.state.userId)
      .then(res => {
        console.log(res.data);
        //setUserStats(res.data);
        this.setState({
          userStats: res.data
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
    if (nextProps.active) {
      this.props.setFabVisibility(true);
      this.props.setSwipability(true);
    }
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
    return (
      <React.Fragment>
        <MyProfileHeader user={{id: this.state.userId, name:this.state.name}}/>
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
