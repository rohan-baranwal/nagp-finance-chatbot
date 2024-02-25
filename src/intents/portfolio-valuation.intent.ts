import { Payload, Platforms, WebhookClient } from "dialogflow-fulfillment";
import { TelegramOriginalRequest } from "../interfaces/original-request.interface";
import { getSession, setSessionItem } from "../services/session.service";
import { GoBackTo } from "../enums/go-back.enum";
import { SessionKeys } from "../enums/session-keys.enum";
import { Contexts } from "../enums/contexts.enum";

const portfolioValuationMain = (agent: WebhookClient): Payload => {
  const session = getSession(agent);
  let payload = {
    "text": `Welcome to BaraFin services.\nSomething is wrong. We are working on fixing it.\nStay tuned!
ERROR: portfolioValuationIntent.1
    `,
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": [
        [{ "text": `🔙 Main Menu 🔙`, "callback_data": GoBackTo.MainMenu }]
      ]
    }
  };

  const portfolioValuationRegex = new RegExp("portfolio-valuation");
  const showPortfolioRegex = new RegExp("show-portfolio");

  if (portfolioValuationRegex.test(agent.query)) {
    setSessionItem(SessionKeys.MainChoice, agent.query, agent, true);
    payload = choosePortfolioValuation(agent);
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

const choosePortfolioValuation = (agent: WebhookClient): any => {
  return {
    "text": "Enter registered phone number",
    "parse_mode": "Markdown",
    // "reply_markup": {
    //   "inline_keyboard": [
    //     [{ "text": `🔙 Main Menu 🔙`, "callback_data": GoBackTo.MainMenu }]
    //   ]
    // }
  };
}

const portfolioValuationIntent = (agent: WebhookClient): void => {
  if ((agent.originalRequest as TelegramOriginalRequest).source === "telegram") {
    const telegramResponse: Payload = portfolioValuationMain(agent);
    agent.add(telegramResponse);
  } else {
    agent.add(`Welcome to BaraFin services.\nSomething is wrong. We are working on fixing it.\nStay tuned!\nERROR: portfolioValuationIntent.2`);
  }
}

export default portfolioValuationIntent;