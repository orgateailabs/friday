const axios  = require('axios');

const URL = 'http://localhost:3030/'

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

module.exports = {getDataByQuery};