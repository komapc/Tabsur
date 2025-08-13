import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Paper, useTheme, useMediaQuery } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import MapIcon from "@mui/icons-material/Map";
import Meals from "../meals/Meals";
import MealMap from "../meals/MealMap";

// Styled components for better visual appearance
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 4,
    borderRadius: '2px 2px 0 0',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  minHeight: 72,
  padding: theme.spacing(1, 3),
  transition: 'all 0.2s ease-in-out',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    transform: 'translateY(-2px)',
  },
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 0.8,
    transform: 'translateY(-1px)',
  },
  '& .MuiTab-iconWrapper': {
    marginBottom: theme.spacing(0.5),
  },
}));

const TabContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: 'calc(100vh - 200px)',
  backgroundColor: theme.palette.background.default,
}));

const TabLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    marginBottom: theme.spacing(0.5),
  },
}));

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center',
            },
            minHeight: 72,
          }}
        >
          <StyledTab 
            icon={<ListIcon />}
            label={
              <TabLabel>
                <span>List View</span>
              </TabLabel>
            } 
            {...a11yProps(0)} 
          />
          <StyledTab 
            icon={<MapIcon />}
            label={
              <TabLabel>
                <span>Map View</span>
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
