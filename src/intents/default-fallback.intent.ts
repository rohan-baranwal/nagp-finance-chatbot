import { Payload, Platforms, WebhookClient } from "dialogflow-fulfillment";
import { getSession, getSessionItem } from "../services/session.service";
import { GoBackTo } from "../enums/go-back.enum";
import { TelegramOriginalRequest } from "../interfaces/original-request.interface";
import { SessionKeys } from "../enums/session-keys.enum";
import { Contexts } from "../enums/contexts.enum";

const fallbackMain = (agent: WebhookClient): Payload => {
  const session = getSession(agent);
  let payload = {
    "text": `Welcome to BaraFin services.\nSomething is wrong. We are working on fixing it.\nStay tuned!
ERROR: fallbackMain.1
    `,
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": [
        [{ "text": `🔙 Main Menu 🔙`, "callback_data": GoBackTo.MainMenu }]
      ]
    }
  };

  // setting last action to repeat
  const lastAction = getSessionItem(SessionKeys.LastAction, agent);
  (agent.query as any) = lastAction;

  if (lastAction?.length) {
    // agent.clearOutgoingContexts();
    const intentKey = lastAction.split(".")[0];
    switch (intentKey) {
      case "FE":
        agent.setContext(Contexts.FundExplorer);
        break;
      case "PV":
      case "TH":
      case "PHN":
        agent.setContext(Contexts.PhoneNumber);
        break;
      default:
        agent.setContext(Contexts.FundExplorer);
        break;
    }
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

const defaultFallbackIntent = (agent: WebhookClient): void => {
  if ((agent.originalRequest as TelegramOriginalRequest).source === "telegram") {
    const telegramResponse: Payload = fallbackMain(agent);
    agent.add(telegramResponse);
  } else {
    agent.add(`Welcome to BaraFin services.\nI didn't get that.\nSomething is wrong. We are working on fixing it.\nStay tuned!\nERROR: fundExplorerMain.2`);
  }
}

export default defaultFallbackIntent;