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
    large: {
        width: theme.spacing(17),
        height: theme.spacing(17),
        borderWidth: theme.spacing(1),
        borderColor: 'white',
        borderStyle: 'solid',
        backgroundColor: 'yellow',
        color: 'Black',
        border: "solid"
    },
    default: {
        backgroundColor: 'yellow',
        color: 'Black',
        border: "solid",
        borderColor: "Black",
        borderWidth: "1px"
    }
}));

const Avatar = (props) => {
    const classes = useStyles();
    const img = null;
    const className = props.class === undefined || props.class === "" ? "default" : props.class;
    console.log(className);
    return (
        <div className={classes.root}>
            <MaterialUiAvatar
                aria-label="recipe"
                src={img}
                className={classes[className]} >
                {
                    props.user !== undefined &&
                        props.user.name !== undefined &&
                        props.user.name.length > 0 &&
                        props.user.id !== props.auth.user.id &&
                        className !== "large"

                        ? props.user.name[0].toUpperCase() : null
                }
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