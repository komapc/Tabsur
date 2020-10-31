import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { getFollowStatus, setFollow, getUserInfo } from "../../actions/userActions"
import Gallery from "./Gallery"

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
          <Avatar class="large" user={props.user} />
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


const ProfileTabs = (props) => {
  const classes = useStylesTabs();

  const [value, setValue] = useState(0);

  const [followStatus, setFollowStatus] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const follow = async (new_status, thisUserId, myUserId) => {

    console.log(`myUserId: ${JSON.stringify(myUserId)}, thisUserId: ${JSON.stringify(thisUserId)}`);
    const body = { followie: thisUserId, status: new_status };
    return setFollow(myUserId, body)
      .then(res => {
        console.log(`Follow res: ${JSON.stringify(res)}`);
        //change in DB, than change state
        return setFollowStatus(new_status);
      })
      .catch(err => {
        //setState({ followStatus: -1 }); // !!!
        return console.error(`setFollow failed: ${JSON.stringify(err)}.`);
      });
  }


  const getFollowStatusEvent = (myUserId, thisUserId) => {

    getFollowStatus(thisUserId)
      .then(res => {
        console.log(`getFollowStatus: ${JSON.stringify(res.data)}`);
        const followers = res.data;
        const found = followers.find(element => element.user_id === myUserId);
        setFollowStatus(found ? found.status : 0);
        console.log(res.data);
      })
      .catch(err => {
        setFollowStatus(-1);
        console.error(err);
      });
  }

  useEffect(() => {
    getFollowStatusEvent(props.myUserId, props.thisUserId);
  }, [props.myUserId, props.thisUserId]);

  const itIsMe = props.auth.user.id !== props.thisUserId;
  const newStatus = followStatus === 3 ? 0 : 3;
  console.log(`props.auth.user.id:  ${JSON.stringify(props.auth.user.id)}, 
              thisUserId:  ${JSON.stringify(props.thisUserId)}`);
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
          itIsMe ?
            <React.Fragment>
              <span style={{ marginBottom: '1vh' }}>{
                followStatus ?
                  <Button variant="contained" startIcon={<NotInterestedIcon />} color="secondary"
                    onClick={() => follow(newStatus, props.thisUserId, props.myUserId)}>UnFollow</Button> :
                  <Button variant="contained" startIcon={<PersonAddIcon />} color="primary"
                    onClick={() => follow(newStatus, props.thisUserId, props.myUserId)}>Follow</Button>
              }</span>

              <span style={{ marginBottom: '1vh' }}>
                <Button variant="contained" startIcon={<CreateIcon />} 
                  color="primary" href={`/ChatUser/${props.thisUserId}`}>Write</Button>
              </span>
            </React.Fragment>
            : <div className="centered"><Button startIcon={<InfoIcon />} 
              variant="contained" color="primary" href={`/About`}>About</Button></div>
        }

      </TabPanel>
      <TabPanel value={value} index={1}>
        <Gallery id={props.thisUserId} />
      </TabPanel>
    </React.Fragment>
  )
}
//#endregion

const ShowUser = (props) => {

  const [user, setUser] = useState({});
  const thisUserId = props.match.params.id;
  const getUserInfoEvent = (userId) => {
    return getUserInfo(userId)
      .then(res => {
        console.log(`getUserInfo: ${JSON.stringify(res.data)}`);
        setUser(res.data[0]);
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }

  const myUserId = props.auth.user.id;

  console.log(`User id: ${thisUserId}`);
  useEffect(() => {
    getUserInfoEvent(thisUserId);
  }, [thisUserId]);

  return (
    <React.Fragment>

      <React.Fragment>
        <BackBarMui history={props.history} />
        <ProfileHeader history={props.history} user={user} />
        <ProfileStats name={user.name} user={user} />
        <ProfileTabs myUserId={myUserId} auth={props.auth} thisUserId={thisUserId}/>
      </React.Fragment>
    </React.Fragment>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(withRouter(ShowUser));
