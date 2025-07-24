import React, { Component } from "react";
// import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import Fab from '@material-ui/core/Fab';
//import Badge from '@material-ui/core/Badge';
import AddIcon from '@material-ui/icons/Add';//todo: use Yana's image
import Zoom from '@material-ui/core/Zoom';

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
        bottom: "48px",
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
        backgroundColor: "White",
        color: "Black",
        border: "solid",
        borderWidth: "1px"
    }
}));

const AppFab = (props) => {
    const classes = useStyles();
    return (
        
        <React.Fragment>
            <div className={classes.root}>
                <div className={classes.wrapper}>
                    <Zoom
                    in={true}
                    >
                    <Fab className={classes.fab} href="/createMealWizard">
                        {/* <Badge badgeContent={props.messagesCount} color="secondary"> */}
                            {/* <ChatIcon /> */}
                            <AddIcon />
                        {/* </Badge> */}
                    </Fab>
                    </Zoom>
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