import React from "react";
import PropTypes from "prop-types";
import MaterialUiAvatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1)
        },
    },
    small: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    large: {
        width: theme.spacing(17),
        height: theme.spacing(17),
        borderWidth: theme.spacing(1), 
        borderColor: 'white', 
        borderStyle:'solid',
        backgroundColor: 'yellow',
        color: 'Black',
        border: "solid"
    },
    default: { 
        backgroundColor: 'yellow', 
        color: 'Black', 
        border: "solid", 
        borderColor: "Black", 
        borderWidth: "1px" },
    list: {  
        backgroundColor: 'yellow', 
        color: 'Black',
        border: "solid",
        borderColor: "Black",
        borderWidth: "1px"
    }
}));

const Avatar = (props) => {
    const classes = useStyles();
    // const img = "api/images/avatar/" + props.user;
    const img = null;
    // console.log(props.auth.user); // autorithed user (YOU)
    // console.log(props.class);
    // console.log(props.user); // user to show (may be also you)
    const className = props.class === undefined || props.class === "" ? "default" : props.class;
    console.log(className);
    return (
        <div className={classes.root}>
            <MaterialUiAvatar aria-label="recipe" alt="Avatar alt string" src={img} className={classes[className]} >
                {props.user !== undefined && props.user.name !== undefined && props.user.name.length > 0 && props.user.id !== props.auth.user.id && className !== "large"? props.user.name[0].toUpperCase() : null}
            </MaterialUiAvatar>
        </div>
    );
}

Avatar.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Avatar);