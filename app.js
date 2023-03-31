const {App}  = require('@slack/bolt');
require('dotenv').config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true,
  appToken:process.env.APP_TOKEN
});

app.message("hello", async ({ command, say }) => { // Replace hello with the message
  try {
    say("Hi! Thanks for PM'ing me!");
  } catch (error) {
      console.log("err")
    console.error(error);
  }
});

app.event('app_mention', async ({ event, context, client, say }) => {
  await say(`<@${event.user}> asked to do ${event.text}`);
});


(async () => {
  await app.start(3000);
  console.log('⚡️ Bolt app started');
})();