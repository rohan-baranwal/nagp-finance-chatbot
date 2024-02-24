import { Payload, Platforms, WebhookClient } from "dialogflow-fulfillment";
import { getSession } from "../services/session.service";
import { GoBackTo } from "../enums/go-back.enum";
import { TelegramOriginalRequest } from "../interfaces/original-request.interface";
import { Events } from "../enums/events.enum";
import fundExplorerInent from "./fund-explorer.intent";

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
  const lastAction = session["sessionStack"].pop();
  (agent.query as any) = lastAction;

  return new Payload(
    "TELEGRAM" as Platforms,
    payload,
    {
      rawPayload: false,
      sendAsMessage: true
    }
  );
}

const getFollowupEvent = (agent: WebhookClient): string | null => {
  const session = getSession(agent);
  const lastAction = session["sessionStack"].pop();

  if (lastAction?.length) {
    const intentKey = lastAction.split(".")[0];
    switch (intentKey) {
      case "FE":
        return Events.FundExplorer;
      case "PV":
      case "TH":
      case "PHN":
      default:
        return null;
    }
  }
  return null
}

const followupEvent = (agent: WebhookClient): void => {
  const session = getSession(agent);
  const lastAction = session["sessionStack"].pop();
  if (lastAction?.length) {
    const intentKey = lastAction.split(".")[0];
    switch (intentKey) {
      case "FE":
        fundExplorerInent(agent);
        break;
      case "PV":
      case "TH":
      case "PHN":
      default:
        break;
    }
  }
}

const defaultFallbackIntent = (agent: WebhookClient): void => {
  if ((agent.originalRequest as TelegramOriginalRequest).source === "telegram") {
    const telegramResponse: Payload = fallbackMain(agent);

    const followupEventValue: string | null = getFollowupEvent(agent);
    agent.add(telegramResponse);
    if (followupEventValue) {
      // agent.setFollowupEvent(followupEvent);
      followupEvent(agent);
    }
  } else {
    agent.add(`Welcome to BaraFin services.\nI didn't get that.\nSomething is wrong. We are working on fixing it.\nStay tuned!\nERROR: fundExplorerMain.2`);
  }
}

export default defaultFallbackIntent;