const cron = require('node-cron');
const User = require("../models/User");
const webpush = require("web-push");
const Subscription = require("../models/Subscription")

// Define the function to reset solvedQuestionToday for students
exports.resetSolvedQuestionToday = async () => {
    try {
        // Update solvedQuestionToday to false for all users with role "Student"
        await User.updateMany({ accountType: "Student" }, { $set: { solvedQuestionToday: false } });

        console.log("SolvedQuestionToday reset successfully for all students.");
    } catch (error) {
        console.error("Error resetting SolvedQuestionToday:", error);
    }
}

// Function to send notifications to students with solvedQuestionToday=false
exports.sendNotificationsToStudents = async () => {
    try {
        console.log("inside sendNotification function....");
        // Fetch subscriptions for students whose solvedQuestionToday is false
        const users = await User.find({
            accountType: "Student",
            solvedQuestionToday: false,
        }).populate({
            path: 'subscriptions',
            model: 'Subscription'
          });

        if (!users || users.length === 0) {
            console.log("No subscriptions found for students with solvedQuestionToday=false.");
            return;
        }

        // const subscriptions = users.map(user => user.subscriptions).reduce((acc, val) => acc.concat(val), []);

        // console.log("listing users....",subscriptions);

        const notificationPayload = {
            title: "Your DSA Progress Needs You!",
            body: "Stay disciplined and keep learning. Log in and solve a question!",
            icon: "https://some-image-url.jpg",
            data: {
                url: "https://dsatracker-frontend.vercel.app/",
            },
        };


        for (const user of users) {
            const subscriptions = user.subscriptions;
            console.log("subscriptions are",subscriptions)

            for (let i = 0; i < subscriptions.length; i++) {
                const subscription = subscriptions[i];
                try {
                    // Send notification using the subscription
                    // await sendNotification(subscription);
                    await webpush.sendNotification(subscription, JSON.stringify(notificationPayload));
                } catch (error) {
                    if (error.statusCode === 410) {
                        // Subscription is no longer valid, remove it
                        await removeSubscription(user, subscription);
                        // Remove the subscription from the array
                        subscriptions.splice(i, 1);
                        // Adjust the index to handle the removed item
                        i--;
                    } else {
                        // Handle other errors accordingly
                        console.error(`Error sending notification: ${error}`);
                    }
                }
            }

            // Update user with updated subscriptions
            user.subscriptions = subscriptions;
            await user.save();
        }

        console.log("Notifications sent successfully.");
    } catch (error) {
        console.error("Error sending notifications:", error);
    }
}

async function removeSubscription(user, subscription) {
    try {
        // Remove subscription from user schema
        const index = user.subscriptions.indexOf(subscription);
        if (index !== -1) {
            user.subscriptions.splice(index, 1);
            await user.save();
        }

        // Remove subscription from subscription schema
        await Subscription.deleteOne({ endpoint: subscription.endpoint });
    } catch (error) {
        console.error(`Error removing subscription: ${error}`);
        throw error; // Re-throw the error for handling elsewhere if needed
    }
}