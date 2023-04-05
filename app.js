const {App}  = require('@slack/bolt');
require('dotenv').config();

const getData = require('./src/lib/getdata');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true,
  appToken:process.env.APP_TOKEN
});

const formatData = (data) => {
  const formattedData = data.map(innerArray => innerArray.map(element => "'" + element + "'").join(" "));
  console.log(formattedData)
  const formattedString = formattedData.join("\n");
  console.log(formattedString);
  return formattedString;
}

app.event('app_mention', async ({ event, context, client, say }) => {
  var botId = context.botUserId;
  var text = event.text.replace(`<@${botId}>`, '')
  var res = await getData.getDataByQuery(text);
  var result  = formatData(res.data)
  await say({"text": `${result}`, "thread_ts": event.thread_ts || event.ts });
});

(async () => {
  await app.start(3000);
  console.log('⚡️ Bolt app started');
})();