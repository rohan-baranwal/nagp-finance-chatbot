import express, { json } from "express";
import { WebhookClient, Payload, RichResponse, Platforms } from "dialogflow-fulfillment";
import { Intents } from "./src/enums/intents.enum";
import { TelegramOriginalRequest } from "./src/interfaces/original-request.interface";
import { Events } from "./src/enums/events.enum";
import mainChoiceIntent from "./src/intents/main-choice.intent";
import defaultWelcome from "./src/intents/default-welcome.inent";
import defaultFallback from "./src/intents/default-fallback.intent";
const app = express();

app.get('/', (req, res) => res.send('server online'));
app.post(`/dialogflow`, json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  console.log(agent.action);

  let intentMap: Map<string, (agent: WebhookClient) => void> = new Map<string, (agent: WebhookClient) => void>();

  intentMap.set(Intents.DefaultWelcome, defaultWelcome);
  intentMap.set(Intents.MainChoice, mainChoiceIntent);
  intentMap.set(Intents.DefaultFallback, defaultFallback);

  agent.handleRequest(intentMap);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Local server listening on ${port}`);
});
