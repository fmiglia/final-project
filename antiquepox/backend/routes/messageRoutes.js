import express from 'express'; // Import express framework
import expressAsyncHandler from 'express-async-handler'; // Import expressAsyncHandler for handling asynchronous middleware
import Message from '../models/messageModel.js'; // Import Message model
import { isAuth, isAdmin, transporter } from '../utils.js'; // Import utility functions and middlewares

const messageRouter = express.Router(); // Create a router instance for messages

const PAGE_SIZE = 12; // Define the number of items per page

// Route to get messages for admin
messageRouter.get(
  '/admin',
  isAuth, // Middleware to check if user is authenticated
  isAdmin, // Middleware to check if user is an admin
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1; // Get page parameter from query or default to 1
    const pageSize = query.pageSize || PAGE_SIZE; // Get pageSize parameter from query or default to PAGE_SIZE

    // Fetch messages based on pagination parameters
    const messages = await Message.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countMessages = await Message.countDocuments(); // Count total number of messages
    res.send({
      messages,
      totalMessages: countMessages, // Include totalMessages in the response
      page,
      pages: Math.ceil(countMessages / pageSize), // Calculate total pages based on pageSize
    });
  })
);

// Route to save a new message
messageRouter.post('/contact', (req, res) => {
  const {
    update_time,
    fullName,
    email,
    subject,
    message,
    replied,
    replyContent,
    replyEmail,
    replySentAt,
  } = req.body; // Destructure message data from request body

  // Create a new message instance
  const newMessage = new Message({
    update_time,
    fullName,
    email,
    subject,
    message,
    replied,
    replyContent,
    replyEmail,
    replySentAt,
  });

  // Save the new message to the database
  newMessage
    .save()
    .then((savedMessage) => {
      res.status(201).json(savedMessage); // Respond with the saved message
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: 'Failed to save message', error: error.message }); // Handle save error
    });
});

// Route to retrieve all messages
messageRouter.get('/', (req, res) => {
  Message.find()
    .then((foundMessages) => res.json(foundMessages)) // Respond with found messages
    .catch((error) => {
      res
        .status(500)
        .json({ message: 'Failed to retrieve messages', error: error.message }); // Handle retrieval error
    });
});

// Route to delete a message
messageRouter.delete('/', (req, res) => {
  const { update_time, fullName, email, subject, message } = req.body; // Destructure message data from request body

  // Find and delete the message
  Message.findOneAndDelete({ update_time, fullName, email, subject, message })
    .then((deletedMessage) => {
      if (deletedMessage) {
        res.json({ message: 'Message deleted successfully' }); // Respond with success message
      } else {
        res.status(404).json({ message: 'Message not found' }); // Handle message not found
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: 'Failed to delete message', error: error.message }); // Handle delete error
    });
});

// Route to send a reply to a message
messageRouter.post('/reply', async (req, res) => {
  const { email, subject, message, replyContent } = req.body; // Destructure reply data from request body

  try {
    // Prepare email content for reply
    const emailContent = {
      from: 'illmiglia@gmail.com', // Change this to your email address
      to: email,
      subject: `Re: ${subject}`, // Append 'Re: ' to the original subject
      html: `
        <h1>Reply to Your Message</h1>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message Reply:</strong> ${message}</p>
        <p>Thank you,</p>
        <p>antiquepox.com</p>
      `,
    };

    console.log('Reply Content:', replyContent); // Log the replyContent value

    // Send the email using the transporter
    const info = await transporter.sendMail(emailContent);
    console.log('Email sent:', info);

    res.json({ message: 'Reply sent successfully' }); // Respond with success message
  } catch (error) {
    console.error('Error sending reply:', error);
    res
      .status(500)
      .json({ message: 'Failed to send reply', error: error.message }); // Handle send reply error
  }
});

export default messageRouter; // Export the messageRouter for use in other files
