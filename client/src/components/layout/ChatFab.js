import React, { Component } from "react";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import Fab from '@material-ui/core/Fab';
import ChatIcon from '@material-ui/icons/Chat';
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    wrapper: {
        position: "absolute",
        top: "10vh",
        right: "5vw"
    },
    fab: {
        backgroundColor: "#FFFFFF",
        color: "#13A049"
    }
}));

const ChatFab = (props) => {
    const classes = useStyles();
    return (
        
        <React.Fragment>
            <div className={classes.root}>
                <div className={classes.wrapper}>
                    <Fab color="transparent" className={classes.fab} href="/chat">
                        {/* <img src={chatFabImg} alt="Chat"/> */}
                        <Badge badgeContent={props.messagesCount} color="secondary">
                        <ChatIcon />
                        </Badge>
                    </Fab>
                </div>
            </div>
        </React.Fragment>
    );
}

class ChatFabWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
          messagesCount: props.messagesCount
        };
      }

    render() {
        return (
            <React.Fragment>
                <ChatFab messagesCount={this.props.messagesCount}/>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    //auth: state.auth,
    notificationsCount: state.notificationsCount,
    messagesCount: state.messagesCount
});

export default connect(mapStateToProps)(ChatFabWrapper);