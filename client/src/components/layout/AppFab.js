import React, { Component } from "react";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import Fab from '@material-ui/core/Fab';
import ChatIcon from '@material-ui/icons/Chat';
import Badge from '@material-ui/core/Badge';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    wrapper: {
        position: "fixed",
        //position: "absolute",
        bottom: "55px",
        //right: "5vw",
        // overflowY: 'visible',
        // overflowX: 'visible',
        zIndex: 1001,

        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        textAlign: 'center'
    },
    fab: {
        backgroundColor: "#13A049",
        color: "#FFFFFF"
    }
}));

const AppFab = (props) => {
    const classes = useStyles();
    return (
        
        <React.Fragment>
            <div className={classes.root}>
                <div className={classes.wrapper}>
                    <Fab className={classes.fab} href="/createMealWizard">
                        {/* <Badge badgeContent={props.messagesCount} color="secondary"> */}
                            {/* <ChatIcon /> */}
                            <AddIcon />
                        {/* </Badge> */}
                    </Fab>
                </div>
            </div>
        </React.Fragment>
    );
}

class FabWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
          messagesCount: props.messagesCount
        };
      }

    render() {
        return (
            <React.Fragment>
                { this.props.visible ? <AppFab messagesCount={this.props.messagesCount}/> : null}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    //auth: state.auth,
    notificationsCount: state.notificationsCount,
    messagesCount: state.messagesCount
});

export default connect(mapStateToProps)(FabWrapper);