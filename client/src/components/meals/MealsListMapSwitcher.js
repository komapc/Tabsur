import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Meals from "../meals/Meals";
import MealMap from "../meals/MealMap";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
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
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  // Correct theme usage here!
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function MealsTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    props.setFabVisibility(true);
    props.setSwipability(newValue !== 1);
    setValue(newValue);
  };

  React.useEffect(() => {
    if (props.active) {
      props.setFabVisibility(true);
      props.setSwipability(value !== 1);
    }
  }, [props.active, value, props.setFabVisibility, props.setSwipability]);

  return (
    <div className={classes.root}>
      <AppBar position="sticky">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tabs"
          centered
          indicatorColor="primary"
          TabIndicatorProps={{
            style: {
              backgroundColor: "primary",
            },
          }}
        >
          <Tab label="List" {...a11yProps(0)} />
          <Tab label="Map" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      {/* Use TabPanel for content */}
      <TabPanel value={value} index={0}>
        <Meals {...props} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MealMap {...props} />
      </TabPanel>
    </div>
  );
}
