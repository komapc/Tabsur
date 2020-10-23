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
    }
}));

const Avatar = (props) => {
    const classes = useStyles();
    const img = null; // tmpAvatarImg
    return (
        <div className={classes.root}>
            <MaterialUiAvatar alt="Avatar alt string" src={img} className={classes.large} />
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