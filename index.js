const express = require("express");
const path = require("path");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const cors = require('cors');
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
app.use(cors())
module.exports = app;

const dbPath = path.join(__dirname, "userData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3006, () => {
      console.log("Server Running at http://localhost:3006/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();


// const authProfile = (req, res, next) => {
//   let jwtToken;
//   const authToken = req.headers["authorization"];

//   if (authToken !== undefined) {
//     jwtToken = authToken.split(" ")[1];
//   }
//   if (jwtToken === undefined) {
//     res.status(401);
//     res.send("Invalid JWT Token");
//   } else {
//     const isToken = jwt.verify(
//       jwtToken,
//       "PRASHANTH_KEY",
//       async (error, payload) => {
//         if (error) {
//           res.status(401);
//           res.send("Invalid JWT Token");
//         } else {
//           req.username = payload.username;
//           next();
//         }
//       }
//     );
//   }
// };


function generateBotResponse(userMessage, messageCount) {
    let botMessage;
  
    switch (messageCount) {
      case 1:
        if (userMessage === 'Hi!' || userMessage === 'Hi') {
          botMessage = {
            text:`Hi! Are you here to apply for the Internship?`,
            buttons: ['YES', 'NO'],
          };
        } else {
          botMessage = `I'm sorry, I didn't understand your response. Please try again.`;
        }
        break;
  
      case 2:
        if (userMessage === 'YES') {
          botMessage = `Please enter your Name`
        } else if (userMessage === 'NO') {
          botMessage = `Thank you for your response. If you change your mind, feel free to reach out to us again.`;
        } else {
          botMessage = `I'm sorry, I didn't understand your response. Please try again.`;
        }
        break;
  
      case 3:
        botMessage = validateName(userMessage)
          ? `Please enter your email ID?`
          :{
            text:`Please enter a valid name.`,
            isValid: false,
          };
        break;
  
      case 4:
        botMessage = validateEmail(userMessage)
          ? `Please select how many years of experience you have with Python/JS/Automation Development:`
          :{
            text:`Please enter a valid email ID.`,
            isValid: false,
          };
        break;
  
      case 5:
        const validExperience = ['1', '2', '3', '4', '5'];
        if (validExperience.includes(userMessage)) {
          // Save the data in the database
          // Create a unique ID for each chat session
          // Save whatsapp number (hosted on a server)
  
          botMessage = `Thanks for connecting. We will get back to you shortly.`;
        } else {
          botMessage = `Please select a valid option from the list.`;
        }
        break;
  
      default:
        botMessage = `I'm sorry, there seems to be an issue. Please try again later.`;
        break;
    }
  
    return botMessage;
  }
  
  function validateName(name) {
    // Name validation logic here
    // Return true if name is valid, otherwise false
    return !/\d/.test(name); // Example: Name should not contain numbers
  }
  
  function validateEmail(email) {
    // Email validation logic here
    // Return true if email is valid, otherwise false
    return /\S+@\S+\.\S+/.test(email); // Example: Basic email format validation
  }
  
  

app.post('/api/sendUserMessage', (req, res) => {
    const {message, messageCount} = req.body; // Extract the user's message from the request body
    
    // Process the user's message and generate a response
    const botMessage = generateBotResponse(message, messageCount);
    
    // Save the chat session data to the database
    // saveChatSession(req.body.sessionId, userMessage, botMessage);
    
    // Send the bot's response back to the user
    // sendWhatsAppMessage(req.body.phoneNumber, botMessage);
    
    // res.sendStatus(200);
    res.send({botMessage})
  });
  

//   app.use('/.netlify/functions/api', router);
//   module.exports.handler = serverless(app)