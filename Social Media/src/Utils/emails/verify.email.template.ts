export const template = (code:string,firstname:string,subject:string): string => `<!DOCTYPE html>
<html>
<head>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
}
    .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;  
        border-radius: 8px;
        border: 1px solid #dddddd;
        overflow: hidden;
    }
    .email-header {
        background-color: #4CAF50;
        color: #ffffff;
        padding: 20px;
        text-align: center;
    }
    
    .email-header h1 {
        margin: 0;
        font-size: 24px;
    }

    .email-body {
        padding: 20px;
        color: #333333;
        line-height: 1.6;
    }
    .email-header h1 {
        margin: 0;
        font-size: 24px;
}
    .activation-button {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #ffffff;
        background-color: #4CAF50;
        text-decoration: none;
        border-radius: 4px;
        margin-top: 20px;
    }   

    .email-footer {
        background-color: #f4f4f4;
        color: #777777;
        padding: 10px;
        text-align: center;
        font-size: 12px;
    }
    .email-footer a {
        color: #4CAF50;
        text-decoration: none;
    }

</style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${subject}</h1>
        </div>  
        <div class="email-body">
            <p>Dear ${firstname},</p>
            <p>Thank you for registering with us! Please use the following code to verify your email address:</p>
            <h2>${code}</h2>
            <p>If you did not request this code, please ignore this email.</p>
            <p>Best regards,<br>
            The Social Media Team</p>
        </div>
    </div>
</body>
</html>`;

