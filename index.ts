import express, { json } from "express";
import { WebhookClient, Payload, RichResponse, Platforms } from "dialogflow-fulfillment";
import { Intents } from "./src/enums/intents.enum";
import { TelegramOriginalRequest } from "./src/interfaces/original-request.interface";
const app = express();

app.get('/', (req, res) => res.send('server online'));
app.post(`/dialogflow`, json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });;

  const welcome = (): void => {
    if ((agent.originalRequest as TelegramOriginalRequest).source === "telegram") {
      const telegramResponse: Payload = new Payload(
        "TELEGRAM" as Platforms,
        {
          "text": "Hi, Welcome to BaraFin services from VSC.\nYou can ask about:",
          "parse_mode": "Markdown",
          "reply_markup": {
            "inline_keyboard": [
              [
                {
                  "text": "Portfolio Valuation",
                  "callback_data": "portfolio-valuation"
                }
              ],
              [
                {
                  "text": "Fund Explorer",
                  "callback_data": "fund-explorer"
                }
              ],
              [
                {
                  "text": "Transaction History",
                  "callback_data": "transaction-history"
                }
              ]
            ]
          }
        },
        {
          rawPayload: false,
          sendAsMessage: true
        }
      )
      agent.add(telegramResponse);

    } else {
      agent.add(`Welcome to agent from ts VS Code!!`);
    }
  };

  let intentMap: Map<string, (agent: WebhookClient) => void> = new Map<string, (agent: WebhookClient) => void>();

  intentMap.set(Intents.DefaultWelcome, welcome);

  agent.handleRequest(intentMap);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Local server listening on ${port}`);
});
