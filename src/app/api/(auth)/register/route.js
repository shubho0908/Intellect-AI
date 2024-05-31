import { ConnectDB } from "@/database";
import { generateTokens } from "@/lib/token";
import { Library } from "@/models/library.models";
import { User } from "@/models/user.models";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing data" },
        { status: 400 }
      );
    }

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    const HashedPassword = await bcrypt.hash(password, 11);

    const username = email?.split("@")[0];

    const user = new User({
      name,
      email,
      username,
      password: HashedPassword,
    });

    await user.save();

    const { refreshToken } = generateTokens({ id: user._id }, "1h");
    user.refreshToken = refreshToken;
    await user.save();

    const library = new Library({ userId: user._id });
    user.library = library._id;
    await user.save();
    await library.save();

    const userResponse = user.toObject();
    delete userResponse?.password;
    delete userResponse?.refreshToken;
    delete userResponse?.tokens;

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const websiteUrl = process.env.APP_URL + "/home";

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Welcome to Intellect.AI 🤖`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <h2 style="color: #333;">Welcome ${userResponse?.name}!</h2>
      <p style="color: #555;">Welcome to Intellect.AI, your new AI companion! We're thrilled to have you on board. May your journey be filled with enlightening and exciting experiences with the power of AI.</p>
      <p style="margin: 20px 0;">
        <a href="${websiteUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Start Creating</a>
      </p>
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
      }
    });

    return NextResponse.json(
      { success: true, data: userResponse },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
