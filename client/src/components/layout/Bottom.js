import React, { useEffect } from "react";
import { connect } from "react-redux";
import store from "../../store";
import setMessagesCount from "../../actions/MessagesActions"
import { setNotificationsCount, setProfileNotificationsCount } from "../../actions/notifications"
import meals from "../../resources/bottom/my_meal.svg";
import chat from "../../resources/bottom/chat.svg"
import profile from "../../resources/bottom/profile.svg"
import search from "../../resources/bottom/search.svg"
import mealsActive from "../../resources/bottom/my_meal_active.svg";
import chatActive from "../../resources/bottom/chat_active.svg"
import profileActive from "../../resources/bottom/profile_active.svg"
import searchActive from "../../resources/bottom/search_active.svg"

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';

const Bottom = (props) => {  
    const index = props.index;    
    // TODO: use tabs enum object from App.js and move it from App.js outside
    useEffect(() => {
    switch (index)
    {
      case 0: break;//Nothing to do?
      case 1: if (props.profileNotificationsCount !== 0)
        store.dispatch(setProfileNotificationsCount(0)); break;
        
      case 2: if (props.notificationsCount !== 0)
        store.dispatch(setNotificationsCount(0)); break;
      
      case 3: if (props.messagesCount !== 0)
        store.dispatch(setMessagesCount(0)); break;
      default:
        console.log(`Switched to non-existing tab ${index}?`);
    }
  }, [props, index]);
    return (
      // <Box
      //   borderRadius="28px 28px 0px 0px" borderColor="black" position="fixed"
      //   bgcolor="primary.secondary" border="solid 1px" className="footer"
      //   margin="3px 3px 0px 0px"
      //   bottom="0px"
      // >
        <div className="footer">
          <Tabs
            value={index}
            onChange={props.onChange}
            centered
            indicatorColor='primary'
            TabIndicatorProps={{
              style: {
                backgroundColor: "primary"
              }
            }}>
            <Tab icon={<img className="footer-icons"
              src={index === 0 ? searchActive : search} alt={"search meals"} />} />
            <Tab icon={
              <Badge badgeContent={props.profileNotificationsCount} color="secondary">
                <img className="footer-icons"
                  src={index === 1 ? profileActive : profile} alt={"profile"} />
              </Badge>} />
            <Tab icon={
              <Badge badgeContent={props.notificationsCount} color="secondary">
                <img className="footer-icons"
                  src={index === 2 ? mealsActive : meals} alt={"my meals"} />
              </Badge>
            } />
            <Tab icon={
              <Badge badgeContent={props.messagesCount} color="secondary">
                {/* <BigChatIcon /> */}
                <img className="footer-icons"
                  src={index === 3 ? chatActive : chat} alt={"chat"} />
              </Badge>
            } />
          </Tabs>
        </div>
      //</Box>
    );
  }


const mapStateToProps = state => ({
  messagesCount: state.messagesCount,
  notificationsCount: state.notificationsCount,
  profileNotificationsCount: state.profileNotificationsCount
});
export default connect(mapStateToProps)(Bottom);