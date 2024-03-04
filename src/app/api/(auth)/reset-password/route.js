import nodemailer from "nodemailer";
import { User } from "@/models/user.models";
import { NextResponse } from "next/server";
import { generateAccessToken } from "@/lib/token";
import { ConnectDB } from "@/database";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email can't be empty" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const token = generateAccessToken({ id: user._id }, "30m");
    const resetLink = `${process.env.APP_URL}/${user._id}/${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Link!",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <h2 style="color: #333;">Password Reset</h2>
      <p style="color: #555;">Hello, ${user?.name}</p>
      <p style="color: #555;">Click the following link to reset your password:</p>
      <p style="margin: 20px 0;">
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      </p>
      <p style="color: #555;">This link is only valid for 30 minutes.</p>
      <p style="color: #555;">If you didn't request a password reset, please ignore this email.</p>
      <p style="color: #888;">Best regards,<br/>Shubhojeet Bera</p>
    </div>
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return NextResponse.json(
          {
            success: false,
            message: "Error sending email",
          },
          { status: 404 }
        );
      } else {
        console.log("Email sent: " + info.response);
        NextResponse.json(
          {
            success: true,
            message: "Password reset link sent to your email",
          },
          { status: 200 }
        );
      }
    });

    return NextResponse.json(
      { success: true, message: "Email sent" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
