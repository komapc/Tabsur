const express = require("express");
const fcm = require('../firebaseCloudMessages');
const pgConfig = require("../dbConfig.js"); 
const { Client } = require("pg");
let currentConfig = pgConfig.pgConfigProduction;
if (process.env.NODE_ENV === "debug")
{
  currentConfig = pgConfig.pgConfigLocal;
}

const pushNotification = (notification, registration_ids) =>
{
  return fcm.sendNotification(JSON.stringify({
    data: notification,
    "registration_ids": registration_ids //resp.rows[0].tokens.split(';')
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
  })
}

const addNotificationToDB = (message) =>
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
  const client = new Client(currentConfig);
  client.connect();
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
    console.log(`Message inserted sucssesfuly.`); 
    console.log(`tokens: ${JSON.stringify(resp.rows)}`);
    return resp;
  })
  .catch(error => {
    console.error(`error: ${JSON.stringify(error)}`);
    return error;
  })
  .finally(() => {
    client.end();
  });
}

//add notificatin/message to the DB + push 
addNotification = async (notification) =>
{
  return addNotificationToDB(notification)
    .then(resp => {
      const tokens = resp.rows[0].tokens;
      console.log(`resp: ${JSON.stringify(tokens)}`);
      return pushNotification(notification, tokens)
      .then(answer => {
        console.log(`answer: ${JSON.stringify(answer)}`);
        return answer;
      })
      .catch(error =>{
        console.error(`pushNotification failed: ${JSON.stringify(error)}`)
      })
    .catch(error =>{
      console.error(`addNotificationToDB failed: ${JSON.stringify(error)}`)
    });
  });
}

module.exports =  addNotification;