import express, { json } from "express";
import { WebhookClient, Payload, RichResponse, Platforms } from "dialogflow-fulfillment";
import { Intents } from "./src/enums/intents.enum";
import mainChoiceIntent from "./src/intents/main-choice.intent";
import defaultWelcome from "./src/intents/default-welcome.inent";
import defaultFallbackIntent from "./src/intents/default-fallback.intent";
import fundExplorerInent from "./src/intents/fund-explorer.intent";
const app = express();

app.get('/', (req, res) => res.send('server online'));
app.post(`/dialogflow`, json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  console.log(agent.action);

  let intentMap: Map<string, (agent: WebhookClient) => void> = new Map<string, (agent: WebhookClient) => void>();

  // INTENT Setups
  intentMap.set(Intents.DefaultWelcome, defaultWelcome);
  intentMap.set(Intents.DefaultFallback, defaultFallbackIntent);
  intentMap.set(Intents.MainChoice, mainChoiceIntent);
  intentMap.set(Intents.FundExplorer, fundExplorerInent)

  agent.handleRequest(intentMap);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Local server listening on ${port}`);
});
