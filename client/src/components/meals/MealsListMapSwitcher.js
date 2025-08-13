import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import listIcon from "../../resources/list_icon.svg";
import mapIcon from "../../resources/map_icon.svg";
import Meals from "../meals/Meals";
import MealMap from "../meals/MealMap";

// Styled components for better visual appearance
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  minHeight: 64,
  padding: theme.spacing(1, 2),
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 0.8,
  },
}));

const TabContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: 'calc(100vh - 200px)',
}));

const TabIcon = styled('img')(({ theme, active }) => ({
  width: '20px',
  height: '20px',
  marginRight: '8px',
  filter: active ? 'none' : 'brightness(0.6)',
  opacity: active ? 1 : 0.7,
  transition: 'all 0.2s ease-in-out',
}));

const TabLabel = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

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
        <TabContent>
          {children}
        </TabContent>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function MealsListMapSwitcher(props) {
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
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
      <StyledAppBar position="sticky" elevation={0}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Meals view switcher"
          centered
          variant="standard"
          sx={{
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center',
            },
            '& .MuiTab-root': {
              minWidth: '120px',
              opacity: 1,
            },
            '& .Mui-selected': {
              opacity: 1,
            },
          }}
        >
          <StyledTab 
            label={
              <TabLabel>
                <TabIcon 
                  src={listIcon} 
                  alt="List View"
                  active={value === 0}
                />
                <span>List</span>
              </TabLabel>
            } 
            {...a11yProps(0)} 
          />
          <StyledTab 
            label={
              <TabLabel>
                <TabIcon 
                  src={mapIcon} 
                  alt="Map View"
                  active={value === 1}
                />
                <span>Map</span>
              </TabLabel>
            } 
            {...a11yProps(1)} 
          />
        </Tabs>
      </StyledAppBar>

      <TabPanel value={value} index={0}>
        <Meals {...props} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MealMap {...props} />
      </TabPanel>
    </Box>
  );
}
