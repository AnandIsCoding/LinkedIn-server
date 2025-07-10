const userRegistrationSuccessEmail = (name) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to Devlinked</title>
    <style>
      body {
        background-color: #e6f2ff;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 40px 0;
        color: #333;
      }

      .container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 40px 30px;
        border-radius: 12px;
        box-shadow: 0 0 10px rgba(0,0,0,0.08);
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
      }

      .header img {
        max-width: 100px;
      }

      .title {
        font-size: 24px;
        color: #1a1a1a;
        margin-top: 20px;
        font-weight: 700;
      }

      .content {
        font-size: 16px;
        line-height: 1.6;
        color: #444;
      }

      .highlight {
        font-weight: 600;
        color: #000;
      }

      .cta {
        display: inline-block;
        margin-top: 30px;
        background-color: #0073b1;
        color: #ffffff;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        transition: background 0.3s ease-in-out;
      }

      .cta:hover {
        background-color: #005983;
      }

      .tips {
        margin-top: 40px;
        padding: 20px;
        background: #f0f8ff;
        border-left: 4px solid #0073b1;
        border-radius: 8px;
      }

      .tips ul {
        margin: 0;
        padding-left: 20px;
        text-align: left;
      }

      .footer {
        text-align: center;
        margin-top: 40px;
        font-size: 13px;
        color: #888;
      }

      a {
        color: #0073b1;
        text-decoration: none;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <img src="https://res.cloudinary.com/dm0rlehq8/image/upload/v1751744657/DevlinkedLogo_mnxc0n.png" alt="Devlinked Logo" />
        <div class="title">Welcome to Devlinked, ${name}!</div>
      </div>

      <div class="content">
        <p>We're thrilled to have you join our professional community!</p>
        <p>You’ve successfully created your account. Let’s now set you up for success.</p>

        <div class="tips">
          <strong>🚀 Quick Tips to Get Started:</strong>
          <ul>
            <li>🧑‍💼 Visit the <strong>“Me” section</strong> from the top-right navbar.</li>
            <li>✍️ Fill in your <strong>profile details</strong> to stand out.</li>
            <li>🔗 Start <strong>connecting</strong> with professionals in your field.</li>
            <li>📝 Share ideas, experiences, and grow your network.</li>
          </ul>
        </div>

        <a class="cta"  href="https://yourdomain.com/profile">Complete My Profile</a>
      </div>

      <div class="footer">
        Need help? Reach us at 
        <a href="mailto:support@yourdomain.com">support@yourdomain.com</a>
      </div>
    </div>
  </body>
  </html>`;
};

export default userRegistrationSuccessEmail;
