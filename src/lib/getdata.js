const axios  = require('axios');

const QUERYURL = "https://orgateai.ue.r.appspot.com/query";
const CONFIGURL = "https://orgateai.ue.r.appspot.com/config";


const getDataByQuery = async (apiKey, dbConfig, query) => {
  try {
    const data = await axios.post(QUERYURL, {
      "api_key": apiKey,
      "db_config": dbConfig,
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
};

const dbConfig = async (apiKey, config) => {
  var body = {
    "db_config": config,
    "api_key": apiKey
  }
  var headers = {
    'Content-Type': 'application/json'
  }
  try {
    const data = await axios.post(CONFIGURL, body, headers);
    return await data.data
  } catch(error){
    console.log("error:" + error);
  }
}

module.exports = {getDataByQuery, dbConfig};