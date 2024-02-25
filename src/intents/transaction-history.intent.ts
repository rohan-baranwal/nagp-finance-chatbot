import { Payload, Platforms, WebhookClient } from "dialogflow-fulfillment";
import { TelegramOriginalRequest } from "../interfaces/original-request.interface";
import { SessionType, getSession, setSessionItem } from "../services/session.service";
import { GoBackTo } from "../enums/go-back.enum";
import { SessionKeys } from "../enums/session-keys.enum";
import { Contexts } from "../enums/contexts.enum";
import userData from "../db/user-funds.json";
import { getPastRandomDate } from "../services/utils";

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

  const transactionHistoryRegex = new RegExp("transaction-history");

  if (transactionHistoryRegex.test(agent.query)) {
    setSessionItem(SessionKeys.MainChoice, agent.query, agent, true);
    payload = choosetransactionHistory(agent);
    // agent.clearOutgoingContexts();
    agent.setContext(Contexts.PhoneNumber);
    // if (!session[SessionKeys.PhoneNumber]?.length) {
    // } else {

    // }
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

const choosetransactionHistory = (agent: WebhookClient): any => {
  return {
    "text": "Enter registered phone number",
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": [
        [{ "text": `🔙 Main Menu 🔙`, "callback_data": GoBackTo.MainMenu }]
      ]
    }
  };
}
const chooseShowHistory = (agent: WebhookClient, session?: SessionType): any => {
  const user = userData[1];
  const transactions: string[] = [];
  user.funds.forEach((fund, index) => {
    const txn = `${index + 1}. *Rs. ${fund.Amount}* added on ${getPastRandomDate()}\n`;
    transactions.push(txn);
  })
  return {
    "text": `
Hi ${user.userName}.
Your transactions:
${transactions.map(t => t)}


Thankyou for using our services. Say "hi" to start again.
    `,
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": [
        [{ "text": `🔙 Main Menu 🔙`, "callback_data": GoBackTo.MainMenu }]
      ]
    }
  }
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