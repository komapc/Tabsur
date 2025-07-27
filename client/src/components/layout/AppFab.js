import React from "react";
import { makeStyles } from '@mui/styles';
import { connect } from "react-redux";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Zoom from '@mui/material/Zoom';
import { createTheme, ThemeProvider } from "@mui/material/styles"; 
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1)
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
        backgroundColor: "White",
        color: "Black",
        border: "solid",
        borderWidth: "1px"
    }
}));

const AppFab = React.memo((props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <Zoom in={props.visible !== false}> {/* Ensure it's not undefined and treat undefined as true */}
                    <Fab className={classes.fab} href="/createMealWizard">
                        <AddIcon />
                    </Fab>
                </Zoom>
            </div>
        </div>
    );
});

const mapStateToProps = state => ({
    auth: state.auth,  //If it is not used - remove
    notificationsCount: state.notificationsCount, //If it is not used - remove
    messagesCount: state.messagesCount //If it is not used - remove
});

export default connect(mapStateToProps)(AppFab);
