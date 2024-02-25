import express, { json } from "express";
import { WebhookClient, Payload, RichResponse, Platforms } from "dialogflow-fulfillment";
import { Intents } from "./src/enums/intents.enum";
import mainChoiceIntent from "./src/intents/main-choice.intent";
import defaultWelcome from "./src/intents/default-welcome.inent";
import defaultFallbackIntent from "./src/intents/default-fallback.intent";
import fundExplorerInent from "./src/intents/fund-explorer.intent";
import phoneNumberInent from "./src/intents/phone-number-intent";
import investAmountIntent from "./src/intents/invest-amount.intent";
import portfolioValuationIntent from "./src/intents/portfolio-valuation.intent";
import transactionHistoryIntent from "./src/intents/transaction-history.intent";
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
  intentMap.set(Intents.FundExplorer, fundExplorerInent);
  intentMap.set(Intents.PortfolioValuation, portfolioValuationIntent);
  intentMap.set(Intents.TransactionHistory, transactionHistoryIntent);
  intentMap.set(Intents.PhoneNumber, phoneNumberInent);
  intentMap.set(Intents.InvestAmount, investAmountIntent);
  // intentMap.set(Intents.Thankyou, thankyouIntent);

  agent.handleRequest(intentMap);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Local server listening on ${port}`);
});
