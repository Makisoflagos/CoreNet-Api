function premiumMail( UserName) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
             background: rgb(2,0,36);
            background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .message-box {
            background-color: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 80%;
        }

        @media (max-width: 768px) {
            .message-box {
                max-width: 90%;
            }
        }
    </style>
</head>
<body>
    <div class="message-box">
        <h1>Hello ${UserName},</h1>
        <p>Thank you for upgrading to the premium version of CoreNet. 
        You have been upgraded to a package that comes with unlimited employee signups. 
        CoreNet is dedicated to providing you with the best in terms of work and tracking.</p>
    </div>
</body>
</html>`
    };

module.exports = {
    premiumMail
}