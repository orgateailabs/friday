const {App}  = require('@slack/bolt');
require('dotenv').config();

const express = require('express');

const localStorage = require('localStorage');

const getData = require('./src/lib/getdata');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true,
  appToken:process.env.APP_TOKEN
});

// Listen for a slash command invocation
app.command('/config', async ({ ack, body, client, logger }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'Friday Config'
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Welcome to a modal with _blocks_'
            }
          },
          {
            "type": "input",
            "block_id": "block_uri",
            "element": {
              "type": "plain_text_input",
              "action_id": "option_0",
              "placeholder": {
                "type": "plain_text",
                "text": "Host uri"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Host"
            }
          }, 
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "option_1",
              "placeholder": {
                "type": "plain_text",
                "text": "database name"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Database name"
            }
          },
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "option_2",
              "placeholder": {
                "type": "plain_text",
                "text": "database user"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Database user"
            }
          },
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "option_3",
              "placeholder": {
                "type": "plain_text",
                "text": "database password"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Database password"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Select Database type"
            },
            "accessory": {
              "type": "static_select",
              "placeholder": {
                "type": "plain_text",
                "text": "Select options",
                "emoji": true
              },
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "MySQL",
                    "emoji": true
                  },
                  "value": "value-0"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "PostgreSQL",
                    "emoji": true
                  },
                  "value": "value-1"
                },
              ],
              "action_id": "multi_static_select-action"
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: "Submit"
        },

      }
    });
    logger.info(result);
    // console.log(client.views.)
  }
  catch (error) {
    logger.error(error);
  }
});

// Handle a view_submission request
app.view('view_1', async ({ ack, body, view, client, logger }) => {
  // Acknowledge the view_submission request
  await ack();

  // Do whatever you want with the input data - here we're saving it to a DB then sending the user a verification of their submission

  // Assume there's an input block with `block_1` as the block_id and `input_a`
  console.log(view['state']['values']['block_uri'])
  console.log(view['state']['values'])
  // console.log(body['user'])
  // const val = view['state']['values']['block_1']['input_a'];
  const user = body['user']['id'];

  // Message to send user
  let msg = '';

  // Message the user
  try {
    await client.chat.postMessage({
      channel: user,
      text: "something"
    });
  }
  catch (error) {
    logger.error(error);
  }

});

const formatData = (data) => {
  const formattedData = data.map(innerArray => innerArray.map(element => "'" + element + "'").join(" "));
  console.log(formattedData)
  const formattedString = formattedData.join("\n");
  console.log(formattedString);
  return formattedString;
}

// Authentication



// pop to get API key and store in the localstorage
app.command("/config", async({command, ask, say}) => {
  // open modal
  // ask api key
  //  - set API key in local-storage
  
})

app.event('app_mention', async ({ event, context, client, say }) => {
  var botId = context.botUserId;
  var text = event.text.replace(`<@${botId}>`, '')
  localStorage.setItem("api-key", "68e9caf7-c7ac-45e0-89b3-42d7733569d9");
  var res = await getData.getDataByQuery(text);
  var result  = formatData(res.data)
  // console.log(localStorage.getItem('api-key'))
  await say({"text": `${result}`, "thread_ts": event.thread_ts || event.ts });
});

(async () => {
  await app.start(3000);
  console.log('⚡️ Bolt app started');
})();