import React from "react";
import { makeStyles } from '@mui/styles';
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Zoom from '@mui/material/Zoom';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme?.spacing ? theme.spacing(1) : '8px'
        }
    },
    wrapper: {
        position: "fixed",
        bottom: "48px",
        zIndex: 1001,
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        textAlign: 'center'
    },
    fab: {
        backgroundColor: "#dc004e",
        color: "White",
        border: "solid",
        borderWidth: "1px",
        borderColor: "#dc004e",
        '&:hover': {
            backgroundColor: "#b8003e"
        }
    }
}));

const AppFab = React.memo((props) => {
    const classes = useStyles();
    const history = useHistory();
    
    const handleClick = () => {
        console.log('FAB clicked - navigating to create meal');
        history.push('/createMealWizard');
    };
    
    console.log('AppFab render - visible:', props.visible);
    
    // Sanity checks
    const isVisible = props.visible !== false; // Default to true if undefined
    console.log('AppFab sanity check - visible prop:', props.visible, 'computed isVisible:', isVisible);
    
    try {
        return (
            <div className={classes.root}>
                <div className={classes.wrapper}>
                    <Zoom 
                        in={isVisible}
                        timeout={300}
                        style={{
                            transitionDelay: isVisible ? '0ms' : '300ms',
                        }}
                    >
                        <Fab className={classes.fab} onClick={handleClick}>
                            <AddIcon />
                        </Fab>
                    </Zoom>
                </div>
            </div>
        );
    } catch (error) {
        console.error('AppFab render error:', error);
        // Fallback without transition
        return (
            <div className={classes.root}>
                <div className={classes.wrapper}>
                    {isVisible && (
                        <Fab className={classes.fab} onClick={handleClick}>
                            <AddIcon />
                        </Fab>
                    )}
                </div>
            </div>
        );
    }
});

const mapStateToProps = state => ({
    auth: state.auth,  //If it is not used - remove
    notificationsCount: state.notificationsCount, //If it is not used - remove
    messagesCount: state.messagesCount //If it is not used - remove
});

export default connect(mapStateToProps)(AppFab);
