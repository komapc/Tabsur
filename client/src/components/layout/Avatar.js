import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import MaterialUiAvatar from '@mui/material/Avatar';
import { makeStyles } from '@mui/styles';
import { connect } from "react-redux";
import config from "../../../src/config.js";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme?.spacing ? theme.spacing(1) : '8px'
        },
    },
    large: {
        width: theme?.spacing ? theme.spacing(17) : '136px',
        height: theme?.spacing ? theme.spacing(17) : '136px',
        borderWidth: theme?.spacing ? theme.spacing(1) : '8px',
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
    const [img, setImg] = useState(null);
    
    useEffect(() => {
        if (!props.user?.id) {
            console.log('Avatar: No user ID provided');
            return;
        }
        
        const avatarRequest = `${config.SERVER_HOST}/api/images/avatar/${props.user.id}`;
        fetch(avatarRequest)
            .then(res => res.json())
            .then((result) => {
                setImg(result);
            })
            .catch(err => {
                console.log('Failed to load avatar:', err);
            });
    }, [props.user?.id]);

    const className = props.class === undefined || props.class === "" ? "default" : props.class;
    
    // Don't render if no user
    if (!props.user) {
        return null;
    }
    
    return (
        <div className={classes.root}>
            <MaterialUiAvatar
                aria-label="user avatar"
                src={img}
                className={classes[className]} >
                {
                    props.user.name &&
                    props.user.name.length > 0 &&
                    props.user.id !== props.auth?.user?.id &&
                    className !== "large" ?
                    props.user.name[0].toUpperCase() : null
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