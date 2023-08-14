// emailTemplates.js

// This function generates the email template with a dynamic link
function acceptMail(link, UserName) {
    return `
    
  <!DOCTYPE html>
  <html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accept Your Task</title>
  <style>
    body {
      background: rgb(2,0,36);
      background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 100%;
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      text-align: center;
    }

    .header h1 {
      font-size: 28px;
      color: #000000;
      margin: 0;
    }

    .slogan {
      font-size: 16px;
      margin: 10px 0;
      color: #FC8019;
    }

    .verification-message {
      font-size: 14px;
      color: #333;
      margin: 15px 0;
    }

    .verification-button {
      display: inline-block;
      background-color: #4275f5;
      color: black;
      border: none;
      border-radius: 4px;
      padding: 10px 20px;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-top: 15px;
      text-decoration: none;
    }

    .verification-button:hover {
      background-color: #FFA75F;
    }

    

    /* Media queries for responsiveness */
    @media (max-width: 767px) { /* Mobile phones */
      .header h1 {
        font-size: 24px;
      }
      .slogan {
        font-size: 14px;
      }
      .verification-message {
        font-size: 12px;
      }
      .verification-button {
        font-size: 12px;
        padding: 8px 16px;
      }
      
    }

    @media (min-width: 768px) and (max-width: 1023px) { /* Tablets */
      .header h1 {
        font-size: 26px;
      }
      .slogan {
        font-size: 15px;
      }
      .verification-message {
        font-size: 13px;
      }
      .verification-button {
        font-size: 14px;
        padding: 10px 18px;
      }
      
    }

    @media (min-width: 1024px) { /* Desktops and laptops */
      .header h1 {
        font-size: 30px;
      }
      .slogan {
        font-size: 16px;
      }
      .verification-message {
        font-size: 14px;
      }
      .verification-button {
        font-size: 16px;
      }
      
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>NEW TASK</h1>
       <p class="slogan">A new task to be completed</p>
    </div>
    <div class="verification-message">Dear ${UserName},</div>
    <div class="verification-message">A new task has been assigned to you. To accept this task, Kindly click the link: </div>
    <a href=${link} class="verification-button">Access Task Page</a>
  </div>

</body>
</html>`
  };

  module.exports ={
    acceptMail
  }