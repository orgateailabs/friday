const {App}  = require('@slack/bolt');
require('dotenv').config();

const axios  = require('axios');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true,
  appToken:process.env.APP_TOKEN
});

const URL = 'http://localhost:3030/'

const getData = async (query) => {
  try {
    const data = await axios.post('http://localhost:3030/query', {
      "api_key": "68e9caf7-c7ac-45e0-89b3-42d7733569d9",
      "query": query
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return await data.data
  }catch(err){
    console.log("error:" + err)
  }

  // console.log(data)
  return await data.json()
}

app.event('app_mention', async ({ event, message, context, client, say }) => {
  var botId = context.botUserId;
  var text = event.text.replace(`<@${botId}>`, '')
  var dataa = await getData(text);
  console.log("dataa:" + dataa.data);
  await say({"text": `<@${event.user}> ${dataa.data}`, "thread_ts": event.thread_ts || event.ts });
});

(async () => {
  await app.start(3000);
  console.log('⚡️ Bolt app started');
})();