const nodemailer = require("nodemailer");

/**
 * Create reusable transporter.
 * Uses SMTP settings from environment variables.
 * Falls back to a development "ethereal" test account if not configured.
 */
let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Use Ethereal for development/testing (emails viewable at ethereal.email)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("📧 Using Ethereal test email account:", testAccount.user);
  }

  return transporter;
};

/**
 * Format date for email display
 */
const formatDateForEmail = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

/**
 * Format time for email display (24h → 12h)
 */
const formatTimeForEmail = (time) => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

/**
 * Send booking confirmation email
 */
const sendBookingConfirmation = async (booking, isReschedule = false) => {
  try {
    const transport = await getTransporter();
    const eventName = booking.eventType?.name || "Meeting";
    const subject = isReschedule
      ? `Meeting Rescheduled: ${eventName}`
      : `Booking Confirmed: ${eventName}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 48px; height: 48px; background: #006BFF; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13l4 4L19 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 style="font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0 0 8px;">
            ${isReschedule ? "Meeting Rescheduled" : "Meeting Confirmed"}
          </h1>
          <p style="font-size: 14px; color: #6b7280; margin: 0;">
            ${isReschedule ? "Your meeting has been rescheduled." : "Your meeting has been booked successfully."}
          </p>
        </div>

        <div style="background: #f8f9fb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 16px; font-weight: 600; color: #1a1a2e; margin: 0 0 16px;">Meeting Details</h2>
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; width: 100px;">Event</td>
              <td style="padding: 6px 0; color: #1a1a2e; font-weight: 500;">${eventName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Date</td>
              <td style="padding: 6px 0; color: #1a1a2e; font-weight: 500;">${formatDateForEmail(booking.date)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Time</td>
              <td style="padding: 6px 0; color: #1a1a2e; font-weight: 500;">${formatTimeForEmail(booking.time)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Duration</td>
              <td style="padding: 6px 0; color: #1a1a2e; font-weight: 500;">${booking.eventType?.duration || 30} minutes</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Invitee</td>
              <td style="padding: 6px 0; color: #1a1a2e; font-weight: 500;">${booking.name} (${booking.email})</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
          Powered by Calendly Clone
        </p>
      </div>
    `;

    const info = await transport.sendMail({
      from: process.env.SMTP_FROM || '"Calendly" <noreply@calendly.local>',
      to: booking.email,
      subject,
      html,
    });

    // Log Ethereal preview URL in development
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("📧 Email preview:", previewUrl);
    }

    return info;
  } catch (error) {
    console.error("Email service error:", error.message);
    throw error;
  }
};

/**
 * Send booking cancellation email
 */
const sendBookingCancellation = async (booking) => {
  try {
    const transport = await getTransporter();
    const eventName = booking.eventType?.name || "Meeting";

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 48px; height: 48px; background: #EF4444; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="color: white; font-size: 24px; font-weight: bold;">✕</span>
          </div>
          <h1 style="font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0 0 8px;">
            Meeting Cancelled
          </h1>
          <p style="font-size: 14px; color: #6b7280; margin: 0;">
            The following meeting has been cancelled.
          </p>
        </div>

        <div style="background: #fef2f2; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; width: 100px;">Event</td>
              <td style="padding: 6px 0; color: #1a1a2e; font-weight: 500;">${eventName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Date</td>
              <td style="padding: 6px 0; color: #1a1a2e; font-weight: 500; text-decoration: line-through;">${formatDateForEmail(booking.date)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Time</td>
              <td style="padding: 6px 0; color: #1a1a2e; font-weight: 500; text-decoration: line-through;">${formatTimeForEmail(booking.time)}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
          Powered by Calendly Clone
        </p>
      </div>
    `;

    const info = await transport.sendMail({
      from: process.env.SMTP_FROM || '"Calendly" <noreply@calendly.local>',
      to: booking.email,
      subject: `Meeting Cancelled: ${eventName}`,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("📧 Cancellation email preview:", previewUrl);
    }

    return info;
  } catch (error) {
    console.error("Email service error:", error.message);
    throw error;
  }
};

module.exports = { sendBookingConfirmation, sendBookingCancellation };
