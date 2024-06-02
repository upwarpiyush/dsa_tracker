const express = require("express");
const webpush = require("web-push");
const app = express();

const userRoutes = require("./routes/User");
const topicRoutes = require("./routes/Topic");
const questionRoutes = require("./routes/Question");
const doneRoutes = require("./routes/Done");
// const getAllTopics = require("./routes/Topic");

const Subscription = require("./models/Subscription");
const User = require("./models/User")
const cron = require('node-cron');
const {sendNotificationsToStudents} = require("./controllers/Subscription")
const {resetSolvedQuestionToday} = require("./controllers/Subscription")

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:test@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

let subscriptions = [];

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"*",
		credentials:true,
	})
)


//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/topic", topicRoutes);
app.use("/api/v1/question", questionRoutes);
app.use("/api/v1/done", doneRoutes);
// app.use("/api/v1/getAllTopics", getAllTopics);


//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.post("/subscribe", (req, res) => {

  // console.log("call aya bhai.....");
  // console.log(req.body.uid);

  const userId = req.body.uid;
  const subscriptionData = req.body.subscription;

  addSubscriptionToUser(userId, subscriptionData);

  async function addSubscriptionToUser(userId, subscriptionData) {
    try {
        // Check if the subscription already exists for the user
        const user = await User.findById(userId).populate('subscriptions');
        const existingSubscription = user.subscriptions.find(sub => sub.endpoint === subscriptionData.endpoint);

        if (existingSubscription) {
            console.log('Subscription already exists for the user.');
            return;
        }

        // Create a new subscription
        const newSubscription = new Subscription(subscriptionData);
        await newSubscription.save();

        // Add the subscription reference to the user
        user.subscriptions.push(newSubscription._id);
        await user.save();

        console.log('Subscription added to user successfully');
    } catch (err) {
        console.error('Error adding subscription to user:', err);
    }
}
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

cron.schedule('0 18 * * *', () => {
    console.log('Running sendNotificationsToStudents cron job...');
    sendNotificationsToStudents();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

cron.schedule('0 0 * * *', () => {
    console.log('Running resetSolvedQuestionTodayForStudents cron job...');
    resetSolvedQuestionToday();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});