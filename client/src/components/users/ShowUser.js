import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import backButton from "../../resources/back_button.svg";
import defaultImage from "../../resources/userpic_empty.svg";
import TextField from '@material-ui/core/TextField';

import { getFollowStatus, setFollow, getUserInfo } from "../../actions/userActions"
import { sendMessage } from "../../actions/notifications"


import PropTypes from "prop-types";
import { registerUser, getUser } from "../../actions/authActions";
import classnames from "classnames";
import Avatar from "../layout/Avatar"
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import tmpBgImg from "../../resources/images/susi.jpeg";
import { makeStyles } from '@material-ui/core/styles';
import { logoutUser } from "../../actions/authActions";
import store from "../../store";

import CreateIcon from '@material-ui/icons/Create';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
//#region ProfileHeader
const useStylesHeader = makeStyles(theme => ({
  alignItemsAndJustifyContent: {
    width: "100%",
    height: theme.spacing(25),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#13A049',
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
    color: "#13A049",
    fontSize: 32,
    fontWeight: "fontWeightBold",
    fontStyle: "bold",
    //fontFamily: "Monospace"
    margin: '20px'
  },
  stat: {
    color: "#13A049",
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
  const userStats=props.userStats;// ? props.userStats[0] : {}; ???
  console.log(`ProfileStats's props: ${JSON.stringify(props)}`);

   return  <React.Fragment>
      {/* {userStats?<div>{ JSON.stringify(userStats)}</div>:<span/>} */}
      <div className={classes.headerContainer}>
        <h5 className={classes.header}>{props.name}</h5>
      </div>
      <div className={classes.headerContainer}>
        <Grid container >
          <Grid item xs={6}><span className={classes.stat}>Followers _</span></Grid>
          <Grid item xs={6}><span className={classes.stat}>Active meals _</span></Grid>
          <Grid item xs={6}><span className={classes.stat}>Following _</span></Grid>
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const useStylesTabs = makeStyles(theme => ({
  root: {
    flexGrow: 1, // ?

    color: "#13A049",
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
 
  const [value, setValue] = React.useState(0); 
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <div className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          indicatorColor='primary'
          TabIndicatorProps={{ style: { backgroundColor: "primary"}}}>
          <Tab label="Kitchen" {...a11yProps(0)} />
          <Tab label="Gallery" {...a11yProps(1)} />
        </Tabs>
      </div>
      <TabPanel value={value} index={0} >
        {/* <div className='centered'> */}
        <div style={{marginBottom: '1vh'}}>{
          props.followStatus ?
          <Button variant="contained" startIcon={<NotInterestedIcon />} color="secondary" onClick={() => props.follow(0)}>UnFollow</Button> :
          <Button variant="contained" startIcon={<PersonAddIcon />} color="primary" onClick={() => props.follow(3)}>Follow</Button>
        }</div>
        {/* </div> */}

        {/* {
            props.auth.user.id !== props.state.id ?
              <div>
                <TextField type="text" id="message" placeholder="Message"></TextField>
                <Button 
                  variant="contained" color="primary"
                  onClick={() => props.sendMessageWithCallback(
                    props.auth.user.id,
                    props.state.id,
                    document.getElementById("message").value
                  )}>Send</Button>
              </div> : null
        } */}
        <div style={{marginBottom: '1vh'}}>
        <Button variant="contained" startIcon={<CreateIcon />} color="primary" href={`/ChatUser/${props.state.id}`}>Write</Button>
        </div>
        {/* <a href={`/ChatUser/${props.state.id}`}>write him</a> */}

      </TabPanel>
      <TabPanel value={value} index={1}>
        Under Construction
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
        const found = followers.find(element => element.follower === myUserId);
        const followStatus = found ? found.status : 0;
        this.setState({ followStatus: followStatus });
        console.log(res.data);
      })
      .catch(err => {
        this.setState({ followStatus: -1 });
        console.log(err);
      });
  }

  follow(new_status) {
    const myUserId = this.props.auth.user.id;
    const thisUserId = this.state.id;
    const body = { followie: thisUserId, status: new_status };
    setFollow(myUserId, body)
      .then(res => {
        console.log(res.data);
        //change in DB, than change state
        this.setState({ followStatus: new_status });
      })
      .catch(err => {
        this.setState({ followStatus: -1 });
        console.log(err);
      });
  }

  getUserInfoEvent() {
    getUserInfo(this.state.id)
      .then(res => {
        console.log(res.data);
        this.setState({ user: res.data[0] });
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  sendMessageWithCallback(sender, receiver, message) {
    sendMessage(sender, receiver, message)
      .then(res => { // Callback
        console.log(JSON.stringify(res));
      });
  }

  render() {
    console.log(`this.state.user: ${JSON.stringify(this.state.user)}`);
    //let userStats = {}

    return (
      <React.Fragment>

        {true ? ( <React.Fragment>
        <IconButton aria-label="back" size="large" color="primary">
          <ArrowBackIcon fontSize="inherit" onClick={this.props.history.goBack} />
        </IconButton>
        <ProfileHeader history={this.props.history}/> {/* TODO: Pass avatar img or use Redux. Avatar image not implemented */}
        <ProfileStats name={this.state.user.name}  userStats={{ meals_created: this.state.user.meals_created }} />
        <ProfileTabs followStatus={this.state.followStatus} follow={this.follow} auth={this.props.auth} state={this.state}/>

        </React.Fragment>) : null}

      {false ? (
      <div className="info-all">
        <div className="info-back-div"><img
          className="info-back"
          alt="back"
          onClick={this.props.history.goBack}
          src={backButton}
        />
          <span className="info-caption">profile</span>
        </div>
        <div className="info-top">
          <img className="info-main-image" src={defaultImage} alt="user" />
          <span className="info-main-name">{this.state.user.name}</span>
        </div>
        <div className="info-fields">
          <div className="row">
            <div className="info-column">Meals created
          </div>
            <div className="info-column">
              {this.state.user.meals_created}
            </div>
          </div>
          <div>You follow him?</div>
          {this.state.followStatus ?
            <Button variant="outlined" color="primary" onClick={() => this.follow(0)}>UnFollow</Button> :
            <Button variant="outlined" color="primary" onClick={() => this.follow(3)}>Follow</Button>}
        </div>
        <div>
          {
            this.props.auth.user.id !== this.state.id ?
              <div>
                <input type="text" id="message" placeholder="Message"></input>
                <Button 
                  variant="outlined" color="primary"
                  onClick={() => this.sendMessageWithCallback(
                    this.props.auth.user.id,
                    this.state.id,
                    document.getElementById("message").value
                  )}>Send</Button>
              </div> :
              <div></div>
          }
        </div>
      </div>
      ) : null}
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
