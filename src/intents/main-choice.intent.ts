import { Payload, Platforms, WebhookClient } from "dialogflow-fulfillment";
import { TelegramOriginalRequest } from "../interfaces/original-request.interface";

const mainChoiceIntent = (agent: WebhookClient) => {
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
    agent.add(`Welcome to BaraFin services.\nSomething is wrong. We are working on fixing it.\nStay tuned!`);
  }

  console.log("here");

}

export default mainChoiceIntent;