// mail/templates/otpVerificationEmail.js
const otpVerificationEmail = (name, otp) => {
  return `
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #3b82f6; font-size: 28px;">Devlinked</h1>
        <p style="font-size: 16px; color: #6b7280;">Welcome to a world of professional connections</p>
      </div>

      <h2 style="color: #111827;">Hello ${name},</h2>
      <p style="font-size: 16px; color: #374151;">
        Thank you for signing up on <strong>Devlinked</strong>! To complete your registration, please verify your email by entering the OTP below:
      </p>

      <div style="margin: 30px 0; text-align: center;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #ffffff; background-color: #3b82f6; padding: 14px 28px; border-radius: 10px;">
          ${otp}
        </span>
      </div>

      <p style="font-size: 14px; color: #6b7280;">
        This OTP is valid for the next <strong>5 minutes</strong>. Please do not share it with anyone.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

      <p style="font-size: 14px; color: #9ca3af;">
        If you didn’t request this, you can safely ignore this email.
      </p>

      <p style="font-size: 14px; color: #6b7280;">
        Cheers,<br/>
        <strong>Team Devlinked</strong>
      </p>

      <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #d1d5db;">
        © ${new Date().getFullYear()} Devlinked. All rights reserved.
      </div>
    </div>
  `;
};

export default otpVerificationEmail;
