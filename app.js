const {App}  = require('@slack/bolt');
require('dotenv').config();

const axios = require('axios');

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
            "block_id": "block_apikey",
            "element": {
              "type": "plain_text_input",
              "action_id": "option_0",
              "placeholder": {
                "type": "plain_text",
                "text": "Your API key"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "API Key"
            }
          }, 
          {
            "type": "input",
            "block_id": "block_uri",
            "element": {
              "type": "plain_text_input",
              "action_id": "option_1",
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
            "block_id": "block_dbname",
            "element": {
              "type": "plain_text_input",
              "action_id": "option_2",
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
            "block_id": "block_user",
            "element": {
              "type": "plain_text_input",
              "action_id": "option_3",
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
            "block_id": "block_dbpass",
            "element": {
              "type": "plain_text_input",
              "action_id": "option_4",
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
            "block_id": "block_dbtype",
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
  }
  catch (error) {
    logger.error(error);
  }
});

// Handle a view_submission request
app.view('view_1', async ({ ack, body, view, client, logger }) => {
  await ack();

  var allValues = view['state']['values']

  var apiKey = allValues['block_apikey']['option_0']['value']
  var dbURI = allValues['block_uri']['option_1']['value']
  var dbName = allValues['block_dbname']['option_2']['value']
  var dbUser = allValues['block_user']['option_3']['value']
  var dbPass = allValues['block_dbpass']['option_4']['value']
  var dbType = allValues['block_dbtype']['multi_static_select-action']['selected_option']['text']['text']

  console.log(apiKey, dbURI, dbName, dbUser, dbPass, dbType)
  var config = {"dburi":dbURI, "dbName": dbName, "dbUser": dbUser, "dbPass": dbPass, "dbType": dbType}
  localStorage.setItem("dbConfig", config)
  localStorage.setItem("apiKey", apiKey)

  var res = await getData.dbConfig(apiKey, config);
  console.log(res)

});

const formatData = (data) => {
  const formattedData = data.map(innerArray => innerArray.map(element => "'" + element + "'").join(" "));
  // console.log(formattedData)
  const formattedString = formattedData.join("\n");
  // console.log(formattedString);
  return formattedString;
}


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