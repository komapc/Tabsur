import React, { Component, useState } from "react";
import Button from '@material-ui/core/Button';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { getFollowStatus, setFollow, getUserInfo } from "../../actions/userActions"
import Gallery from "./Gallery"
import { sendMessage } from "../../actions/notifications"

import PropTypes from "prop-types";
import Avatar from "../layout/Avatar"
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import CreateIcon from '@material-ui/icons/Create';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import BackBarMui from "../layout/BackBarMui";
import InfoIcon from '@material-ui/icons/Info';

//#region ProfileHeader
const useStylesHeader = makeStyles(theme => ({
  alignItemsAndJustifyContent: {
    width: "100%",
    height: theme.spacing(25),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
    //backgroundImage: `url(${tmpBgImg})`,
    backgroundSize: 'cover',
  },
  empty: {
    height: 64
  },
  wrapper: {
    marginTop: '190px'
  },
  margin: {
    margin: {
      margin: theme.spacing(1),
    },
  }
}))
const ProfileHeader = (props) => {
  const classes = useStylesHeader()
  return (
    <React.Fragment>
      <div className={classes.alignItemsAndJustifyContent}>
        <div className={classes.wrapper}>
          <Avatar />
        </div>
      </div>
      <div className={classes.empty}></div>
    </React.Fragment>
  )
}
//#endregion


//#region ProfileStats
const useStylesStats = makeStyles(theme => ({
  headerContainer: {
    width: "100%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    color: "black",
    fontSize: 32,
    fontWeight: "fontWeightBold",
    fontStyle: "bold",
    //fontFamily: "Monospace"
    margin: '20px'
  },
  stat: {
    color: "black",
    fontSize: 16,
    fontWeight: "fontWeightBold",
    alignItems: 'left',
    justifyContent: 'left',
    display: 'flex',
    paddingLeft: '30%'
  }
}))

const ProfileStats = (props) => {

  const classes = useStylesStats();
  const userStats = props.user;// ? props.userStats[0] : {}; ???
  //const user = props.user;
  console.log(`ProfileStats's props: ${JSON.stringify(props)}`);

  return <React.Fragment>
    <div className={classes.headerContainer}>
      <h5 className={classes.header}>{props.name}</h5>
    </div>
    <div className={classes.headerContainer}>
      <Grid container >
        <Grid item xs={6}><span className={classes.stat}>Followers  {userStats.followers}</span></Grid>
        <Grid item xs={6}><span className={classes.stat}>Active meals  {userStats.active_meals}</span></Grid>
        <Grid item xs={6}><span className={classes.stat}>Following  {userStats.following}</span></Grid>
        <Grid item xs={6}><span className={classes.stat}>Meals Created {userStats.meals_created}</span></Grid>
      </Grid>
    </div>
  </React.Fragment>

}
//#endregion

//#region ProfileTabs
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
          <Typography>{children}</Typography>
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


const ProfileTabs = (props) => {
  const classes = useStylesTabs();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const itIsMe = props.auth.user.id !== props.state.id;
  const newStatus = props.followStatus == 3? 0 : 3;
  console.log(`props.auth.user.id :
    ${JSON.stringify(props.auth.user.id)}, props.state.id :
    ${JSON.stringify(props.state.id)}`)
  return (
    <React.Fragment>
      <div className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          indicatorColor='primary'
          TabIndicatorProps={{ style: { backgroundColor: "primary" } }}>
          <Tab label="Kitchen" {...a11yProps(0)} />
          <Tab label="Gallery" {...a11yProps(1)} />
        </Tabs>
      </div>
      <TabPanel value={value} index={0} >
        {
           itIsMe?
            <React.Fragment>
              <span style={{ marginBottom: '1vh' }}>{
                props.followStatus ?
                  <Button variant="contained" startIcon={<NotInterestedIcon />} color="secondary" 
                    onClick={() => props.follow(newStatus, props.auth.user.id)}>UnFollow</Button> :
                  <Button variant="contained" startIcon={<PersonAddIcon />} color="primary" 
                    onClick={() => props.follow(newStatus, props.auth.user.id)}>Follow</Button>
              }</span>

              <span style={{ marginBottom: '1vh' }}>
                <Button variant="contained" startIcon={<CreateIcon />} color="primary" href={`/ChatUser/${props.state.id}`}>Write</Button>
              </span>
            </React.Fragment>
            : <div className="centered"><Button startIcon={<InfoIcon />} variant="contained" color="primary" href={`/About`}>About</Button></div>
        }

      </TabPanel>
      <TabPanel value={value} index={1}>
        <Gallery id={props.state.id} />
      </TabPanel>
    </React.Fragment>
  )
}
//#endregion

class ShowUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      user: {},
      followStatus: 0,
      ...props
    };
  }

  componentDidMount() {
    this.getUserInfoEvent();
    this.getFollowStatusEvent();
  }

  getFollowStatusEvent() {
    const myUserId = this.props.auth.user.id;
    const thisUserId = this.state.id;
    getFollowStatus(thisUserId)
      .then(res => {
        console.log(`getFollowStatus: ${JSON.stringify(res.data)}`);
        const followers = res.data;
        const found = followers.find(element => element.user_id === myUserId);
        const followStatus = found ? found.status : 0;
        this.setState({ followStatus: followStatus });
        console.log(res.data);
      })
      .catch(err => {
        this.setState({ followStatus: -1 });
        console.error(err);
      });
  }

  follow(new_status, myId) {

    const myUserId = myId;
    const thisUserId = this.state.id;
    
    console.log(`myId: ${JSON.stringify(myId)}, thisUserId: ${JSON.stringify(this.state.id)}`);
    const body = { followie: thisUserId, status: new_status };
    setFollow(myUserId, body)
      .then(res => {
        console.log(`Follow res: ${JSON.stringify(res)}`);
        //change in DB, than change state
        this.setState({ followStatus: new_status });
      })
      .catch(err => {
        //this.setState({ followStatus: -1 }); // !!!
        console.error(err);
      });
  }

  getUserInfoEvent() {
    getUserInfo(this.state.id)
      .then(res => {
        console.log(`getUserInfo: ${JSON.stringify(res.data)}`);
        this.setState({ user: res.data[0] });
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }

  sendMessageWithCallback(sender, receiver, message) {
    sendMessage(sender, receiver, message)
      .then(res => { // Callback
        console.log(JSON.stringify(res));
      })
      .catch(err => {
        console.error(`sendMessage failed: ${err}`);
      });;
  }

  render() {
    return (
      <React.Fragment>

        <React.Fragment>
          <BackBarMui history={this.props.history} />
          <ProfileHeader history={this.props.history} /> {/* TODO: Pass avatar img or use Redux. Avatar image not implemented */}
          <ProfileStats name={this.state.user.name}
            user={this.state.user}

          />
          <ProfileTabs followStatus={this.state.followStatus} 
            follow={(n, myId) => { this.follow(n, myId) }} 
            auth={this.props.auth} state={this.state} />

        </React.Fragment>

      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(withRouter(ShowUser));
