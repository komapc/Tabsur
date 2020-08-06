import dishes from "../../resources/servings_icon.svg"
import location from "../../resources/location_icon.svg"
import time from "../../resources/date_time_icon.svg"
import fullUp from "../../resources/full_up.svg";
import defaultImage from "../../resources/userpic_empty.svg";

import { withRouter } from "react-router-dom";
import { joinMeal } from "../../actions/mealActions"
import { connect } from "react-redux";
import config from "../../config";

import "./Meals.css";

import React from "react";

import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import NotInterestedIcon from '@material-ui/icons/NotInterested';


import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckIcon from '@material-ui/icons/Check';

var dateFormat = require('dateformat');

const useStyles = makeStyles((theme) => ({
  root: {
    //maxWidth: 345,
    marginTop: '3vh',
    marginBottom: '3vh',
    marginLeft: '5vW',
    marginRight: '5vw',

    width:'90vw'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: '#13A049',
  },
}));
function RecipeReviewCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        // title="Shrimp and Chorizo Paella"
        title={props.owner}
        // subheader="September 14, 2016"
        subheader={props.dat}
      />
      <CardMedia
        className={classes.media}
        image={props.path}
        title="Meal picture"
      />
      <CardContent>
        {/* <Typography variant="body2" color="textSecondary" component="p">
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography> */}
      </CardContent>
      <CardActions disableSpacing>
        <AttendButton meal={props.meal} auth={props.auth} onJoin={props.onJoin} />
        {/* <IconButton aria-label="join">
          <CheckIcon />
        </IconButton> */}
        <IconButton aria-label="like">
          <FavoriteIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            Hi.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}

class AttendButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meal: props.meal
    };
  }

  handleAttend = (event, new_status) => {
    event.stopPropagation();
    const user_id = this.props.auth.user.id;
    console.log("handleAttend: " + JSON.stringify(this.state.meal) + ", " + user_id);
    this.props.onJoin(this.state.meal, new_status);
  }

  render() {
    const meal = this.props.meal;
    const status = meal.attend_status;
    const isOwner = meal.host_id === this.props.auth.user.id;
    let attendButton = <span />;
    if (meal.guest_count <= meal.Atendee_count) {
      attendButton = <img
        className="attend-button"
        src={fullUp}
        alt={"attend"}
        onClick={
          (event) => {
            this.handleAttend(event, 0)
          }
        }
      />
    }
    else if (isOwner) {
      attendButton = <span />;
    }
    else if (status <= 0) {
      attendButton = <Button startIcon={<DoneIcon />} variant="outlined" color="primary" size="small" onClick={(event) => { this.handleAttend(event, 3) }}>
      Join
    </Button>
    }
    else {
      attendButton = <Button startIcon={<NotInterestedIcon />} variant="outlined" color="secondary" size="small" onClick={(event) => { this.handleAttend(event, 0) }}>Recall</Button>  }

    return <span className="attend-button">
      {attendButton}
    </span>
  }
};

class MealImage extends React.Component {
  render() {
    var path = this.props.meal.path;
    path = path ?
      `${config.SERVER_HOST}/api/${path}.undefined` : defaultImage;
    return <img src={path}
      alt={path} className="meal-image" />
  }
}
class MealListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meal: this.props.meal,
      auth: this.props.auth
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.meal !== this.props.meal) {
      this.setState({ meal: this.props.meal });
    }
  }

  gotoMeal = (event, meal) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.history.push({
      pathname: '/Meal',
      state: { meal: meal }
    });
  }
  goToUser = (event, host_id) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.history.push(`/user/${host_id}`);
  }

  goToMaps = (event, id) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.history.push(`/MealMap/${id}`);
  }

  onJoin = (meal, new_status) => {
    const status = new_status;
    const user_id = this.props.auth.user.id;
    const attend = { user_id: user_id, meal_id: meal.id, status: new_status };

    this.props.joinMeal(attend, user_id);
    const increment = status > 0 ? 1 : -1;
    this.setState((prevState => {
      let meal = Object.assign({}, prevState.meal);  // creating copy
      meal.Atendee_count = +meal.Atendee_count + +increment;
      meal.attend_status = new_status;
      return { meal };
    }));
  }
  render() {

    const meal = this.state.meal;
    const owner = meal.host_id === this.props.auth.user.id ? "YOU" : meal.host_name;
    console.log("MealListItem: " + JSON.stringify(meal));
    if (Object.keys(meal).length === 0) { // ?
      return <div>EMPTY MEAL</div>
    }
    const dat = dateFormat(new Date(meal.date), "dd-mm-yyyy HH:MM");
    var path = this.props.meal.path;
    path = path ?
      `${config.SERVER_HOST}/api/${path}.undefined` : defaultImage;
    return (
      <React.Fragment>

        {/* <RecipeReviewCard path={path} owner={owner} meal={meal}
            auth={this.props.auth}
            onJoin={this.onJoin} dat={dat}/> */}
      <div className="meal-props" onClick={(event) => { this.gotoMeal(event, meal) }}>
        <span className="meal-props-left">
          <MealImage meal={meal} />
          <div>
            <img className="meal-info-icons" src={dishes} alt={"number of portions"} />
            <span className="meal-guests">({meal.guest_count}/{meal.Atendee_count})</span>
          </div>
        </span>
        <span className="meal-props-right">
          <AttendButton
            meal={meal}
            auth={this.props.auth}
            onJoin={this.onJoin} />
          <div className="meal-owner-div">by <span className="meal-owner"
            onClick={(event) => { this.goToUser(event, meal.host_id) }}>{owner} </span>
          </div>
          <div className="meal-name" > {meal.name}</div>
          <div className="meal-info-item">
            <img className="meal-info-icons" src={time} alt={"date"} />
            <span className="meal-info">{dat}</span>
          </div>
          <div className="meal-info-item">
            <img className="meal-info-icons" src={location} alt={"address"} />
            <span
              onClick={(event) => { this.goToMaps(event, meal.id) }}
              className="meal-info">{meal.address}
            </span>
          </div>
        </span>
      </div>
      </React.Fragment>
    )
  };
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { joinMeal }
)(withRouter(MealListItem));