import defaultImage from "../../resources/userpic_empty.svg";
import { withRouter } from "react-router-dom";
import { joinMeal } from "../../actions/mealActions"
import { connect } from "react-redux";
import config from "../../config";
import "./Meals.css";
import React from "react";
import Switch from '@material-ui/core/Switch';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from "../layout/Avatar"
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PeopleIcon from '@material-ui/icons/People';
import FormControlLabel from '@material-ui/core/FormControlLabel';
var dateFormat = require('dateformat');

const useStyles = makeStyles((theme) => ({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#dc004e',
    }
  },
  root: {
    //maxWidth: 345,
    //marginTop: '3vh',
    marginBottom: '5vh',
    //marginLeft: '5vW',
    //marginRight: '5vw',

    width: '100vw'
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
  card: {
    margin: "5vw",
    width: "90vw",
    borderRadius: 20,
    borderColor: "Black"
   }
}));
function MealViewCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#FFFF00',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  
  return (
    <ThemeProvider theme={theme}>
    <Card className={classes.root} classes={{ root: classes.card }} >
      <CardHeader
        onClick={(event) => { props.gotoMeal(event, props.meal) }}
        avatar={<Avatar class="default" user={{name: props.owner, id: props.meal.host_id}}/>}
        action={
          <IconButton aria-label="settings">
            {/* <MoreVertIcon /> */}
          </IconButton>
        }
        title={<React.Fragment><span style={{ fontWeight: 900 }}>{props.meal.name}</span></React.Fragment>}
        subheader={<React.Fragment><span onClick={(event) => { props.goToUser(event, props.meal.host_id) }}>{`by ${props.owner}`}</span></React.Fragment>}
      />
      {props.path.indexOf('/static/media/userpic_empty') === -1 ?
        <CardMedia
          onClick={(event) => { props.gotoMeal(event, props.meal) }}
          className={classes.media}
          image={props.path}
          title="Meal picture"
        /> :
        null}
      <CardContent onClick={(event) => { props.gotoMeal(event, props.meal) }}>
        <Typography variant="body2" color="textPrimary" component="p">
          <ScheduleIcon fontSize='small' style={{ color: 'black', }} /> {props.dat}
        </Typography>

        {/* <Typography variant="body2" color="textPrimary" component="p" onClick={(event) => { props.goToMaps(event, props.meal.id) }}>
          <RoomIcon fontSize='small' style={{ color: 'black', }} /> {props.meal.address}
        </Typography> */}
        <Typography variant="body2" color="textPrimary" component="p">
          <PeopleIcon fontSize='small' style={{ color: 'black', }} /> {props.meal.guest_count}<span style={{ color: 'gray' }}>/</span>{props.meal.Atendee_count}
        </Typography>
        {/* <Typography variant="body2" color="textSecondary" component="p">
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography> */}
      </CardContent>
      <CardActions disableSpacing>
        {props.auth.user.id === props.meal.host_id ? null : 
        <AttendButton meal={props.meal} auth={props.auth} onJoin={props.onJoin} />}
        {/* <IconButton aria-label="join">
          <CheckIcon />
        </IconButton> */}
        {/* <IconButton aria-label="like">
          <FavoriteIcon />
        </IconButton> */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          {/* <ExpandMoreIcon /> */}
        </IconButton>
      </CardActions>
      {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            Hi.
          </Typography>
        </CardContent>
      </Collapse> */}
    </Card>
    </ThemeProvider>
  )
}

class AttendButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meal: props.meal
    };
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.meal !== this.props.meal) {
      this.setState({ meal: this.props.meal });
    }
  }
  handleAttend = (event, newStatus, isEnabled) => {
    event.stopPropagation();
    if (!isEnabled)
      return;
    const user_id = this.props.auth.user.id;
    console.log(`handleAttend:  ${JSON.stringify(this.state.meal)}, ${user_id}, new status: ${newStatus}`);
    this.props.onJoin(newStatus);
  }

  render() {
    const meal = this.state.meal;
    const status = meal.attend_status;
    const isOwner = meal.host_id === this.props.auth.user.id;
    const isEnabled = (status > 0) || (meal.guest_count >= meal.Atendee_count);

    const newStatus = status === 0 ? 3 : 0;
    return <FormControlLabel
      hidden={isOwner}
      disabled={!isEnabled}
      onClick={event => this.handleAttend(event, newStatus, isEnabled)}
      control={
        <Switch
          checked={status > 0}
          name="AttendSwitch"
          color="primary"
        />
      }
      label="Attend"
    />
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
      pathname: `/meal/${meal.id}`,
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
    this.props.history.push(`/MealMap/${id}`);//todo: fix, redirect properly to the map
  }

  onJoin = (newStatus) => {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push(`/Login`);
    }
    const user_id = this.props.auth.user.id;
    const meal = this.state.meal;
    const attend = { user_id: user_id, meal_id: meal.id, status: newStatus };

    this.props.joinMeal(attend, user_id);
    const increment = newStatus > 0 ? 1 : -1;
    this.setState((prevState => {
      let meal = Object.assign({}, prevState.meal);  // creating copy
      meal.Atendee_count = +meal.Atendee_count + +increment;
      meal.attend_status = newStatus;
      return { meal };
    }));
  }
  render() {

    const meal = this.state.meal;
    if (!meal)
    {
      console.error(`No meal given.`);
      return <> </>
    }
    const owner = meal.host_id === this.props.auth.user.id ? "YOU" : meal.host_name;
    console.log(`MealListItem: ${JSON.stringify(meal)}.`);
    if (Object.keys(meal).length === 0) { // ?
      return <div>EMPTY MEAL</div>
    }
    try
    {
      const dat = dateFormat(new Date(meal.date), "dd-mm-yyyy HH:MM");
      var path = this.state.meal.path;
      path = path ? `${config.SERVER_HOST}/api/${path}.undefined` : defaultImage;
      return (
          <MealViewCard
            path={path}
            owner={owner}
            meal={meal}
            auth={this.props.auth}
            onJoin={this.onJoin}
            dat={dat}
            goToUser={this.goToUser}
            goToMaps={this.goToMaps}
            gotoMeal={this.gotoMeal} />
      )
    }
    catch(err)
    {
      console.error(err);
      return <> </>
    }
  };
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { joinMeal }
)(withRouter(MealListItem));