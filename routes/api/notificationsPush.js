const express = require("express");
const fcm = require('../firebaseCloudMessages');
const pool = require("../db.js");

const pushNotification = (notification, registration_ids) =>
{
  return fcm.sendNotification(JSON.stringify({
    notification: notification,
    "registration_ids": registration_ids !== null && registration_ids.length > 0 ? registration_ids.split(';') : ""
  })) 
  .then(response =>
  {
    console.log(JSON.stringify(`Got a response from fcm: ${JSON.stringify(response) }`));
    return response;
  })
  .catch(error =>
  {
    console.error(`Error in sendNotification: ${JSON.stringify(error)}`);
    return error;
  })
  .finally(()=>
  {
    console.log('pushNotification done.'); 
  });
};

const addNotificationToDB = async (message) =>
{

//example of param:
// const message =
// {
//   title: 'Attend', 
//   body:  'A user wants to join your meal', 
//   icon: 'resources/Message-Bubble-icon.png', 
//   click_action: '/Meals/',
//   receiver: attend.user_id,
//   meal_id:  attend.meal_id,
//   sender: -1,
//   type: 5
// }

  const query = `
  INSERT INTO notifications (meal_id, receiver, message_text, sender, note_type, 
        click_action, icon, title) 
      VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8)

    RETURNING (
            SELECT array_to_string(array_agg(token),';') 
            AS tokens 
            FROM user_tokens
            WHERE user_id=$2 
          )
    `;
    const client = await pool.connect();
  console.log(`Connected.`);
  return client.query(query,     
    [message.meal_id, 
      message.receiver,
      message.body, 
      message.sender, 
      message.type,
      message.click_action, 
      message.icon,
      message.title, 
     ] )
  .then(resp => {
    console.log(`Message inserted successfully.`); 
    console.log(`tokens: ${JSON.stringify(resp.rows)}`);
    return resp;
  })
  .catch(error => {
    console.error(`error: ${JSON.stringify(error)}`);
    return error;
  })
  .finally(() => {
    client.release();
  });
};

//add notificatin/message to the DB + push 
addNotification = async (notification) =>
{
  return addNotificationToDB(notification)
    .then(resp => {
      const tokens = resp.rows[0].tokens;
      console.log(`Resp tokens: ${JSON.stringify(tokens)}.`);
      return pushNotification(notification, tokens)
      .then(answer => {
        console.log(`Answer: ${JSON.stringify(answer)}.`);
        return answer;
      })
      .catch(error =>{
        console.error(`pushNotification failed: ${JSON.stringify(error)}.`);
      })
    .catch(error =>{
      console.error(`addNotificationToDB failed: ${JSON.stringify(error)}.`);
    });
  });
};

module.exports =  addNotification;