const express = require('express')
const { WebhookClient,Card, Suggestion } = require('dialogflow-fulfillment')
const app = express()

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  function welcome () {
    agent.add('Welcome to my agent from vs code!')
  }
  function bookappointment(agent) {
    console.log(agent);
    if(!agent.parameters.customername){
      agent.add(`Please provide your name`);
    }
   agent.add(`Your appointent is booked`);
 }

  let intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('bookappointment', bookappointment);
  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080)