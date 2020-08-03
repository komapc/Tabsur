import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Meals from "../meals/Meals";
import MealMap from "../meals/MealMap";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      {/* <AppBar position="static"> */}
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered>
          <Tab label="List" {...a11yProps(0)} />
          <Tab label="Map" {...a11yProps(1)} />
        </Tabs>
      {/* </AppBar> */}
      {/* <TabPanel value={value} index={0}>
        <Meals/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MealMap />
      </TabPanel> */}
       <div style={{display: value === 0 ? 'inline' : 'none'}}><Meals/></div>
       <div style={{display: value === 1 ? 'inline' : 'none'}}><MealMap/></div>
    </div>
  );
}