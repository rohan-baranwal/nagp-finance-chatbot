import { Payload, Platforms, WebhookClient } from "dialogflow-fulfillment";
import { TelegramOriginalRequest } from "../interfaces/original-request.interface";
import { Intents } from "../enums/intents.enum";
import { getSession } from "../services/session.service";

const mainChoiceIntent = (agent: WebhookClient) => {
  const session = getSession(agent);
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
                "text": `1. Portfolio Valuation`,
                "callback_data": "PV.portfolio-valuation"
              }
            ],
            [
              {
                "text": `2. Fund Explorer`,
                "callback_data": "FE.fund-explorer"
              }
            ],
            [
              {
                "text": `3. Transaction History`,
                "callback_data": "TH.transaction-history"
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
    agent.add(`Welcome to BaraFin services.\nSomething is wrong. We are working on fixing it.\nStay tuned! mci`);
  }
}

export default mainChoiceIntent;