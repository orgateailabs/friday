const axios  = require('axios');

const URL = 'http://localhost:3030/'

const dbConfigURL = "";

const getDataByQuery = async (query) => {
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
    const data = await axios.post(dbConfigURL, body, headers);
    return await data.data
  } catch(error){
    console.log("error:" + error);
  }
}

module.exports = {getDataByQuery, dbConfig};