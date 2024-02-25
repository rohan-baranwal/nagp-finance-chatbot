import { Payload, Platforms, WebhookClient } from "dialogflow-fulfillment";
import { TelegramOriginalRequest } from "../interfaces/original-request.interface";
import { getSession, setSessionItem } from "../services/session.service";
import { GoBackTo } from "../enums/go-back.enum";
import { SessionKeys } from "../enums/session-keys.enum";
import { Contexts } from "../enums/contexts.enum";

const transationHistoryMain = (agent: WebhookClient): Payload => {
  const session = getSession(agent);
  let payload = {
    "text": `Welcome to BaraFin services.\nSomething is wrong. We are working on fixing it.\nStay tuned!
ERROR: transactionHistoryIntent.1
    `,
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": [
        [{ "text": `🔙 Main Menu 🔙`, "callback_data": GoBackTo.MainMenu }]
      ]
    }
  };

  const transactionHistoryRegex = new RegExp("portfolio-valuation");
  if (transactionHistoryRegex.test(agent.query)) {
    setSessionItem(SessionKeys.MainChoice, agent.query, agent, true);
    // payload = choosetransactionHistory(agent);
    agent.clearOutgoingContexts();
    agent.setContext(Contexts.PhoneNumber);
  }


  return new Payload(
    "TELEGRAM" as Platforms,
    payload,
    {
      rawPayload: false,
      sendAsMessage: true
    }
  );
}

const transactionHistoryIntent = (agent: WebhookClient): void => {
  if ((agent.originalRequest as TelegramOriginalRequest).source === "telegram") {
    const telegramResponse: Payload = transationHistoryMain(agent);
    agent.add(telegramResponse);
  } else {
    agent.add(`Welcome to BaraFin services.\nSomething is wrong. We are working on fixing it.\nStay tuned!\nERROR: transactionHistoryIntent.2`);
  }
}

export default transactionHistoryIntent;