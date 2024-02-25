import { Payload, Platforms, WebhookClient } from "dialogflow-fulfillment";
import { TelegramOriginalRequest } from "../interfaces/original-request.interface";
import { SessionType, getSession, setSessionItem } from "../services/session.service";
import { GoBackTo } from "../enums/go-back.enum";
import { SessionKeys } from "../enums/session-keys.enum";
import { Contexts } from "../enums/contexts.enum";
import userData from "../db/user-funds.json";

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
    agent.clearOutgoingContexts();
    if (!session[SessionKeys.PhoneNumber]?.length) {
      agent.setContext(Contexts.PhoneNumber);
    } else {

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
  const totalAmount = user.funds.reduce((acc, fund) => {
    return acc + parseInt(fund.Amount);
  }, 0);
  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  return {
    "text": `
Hi ${user.userName}.
Your ${agent.query.includes("1") ? "Portfolio - Long Term" : "Portfolio - Year End"} has total value of
*Rs. ${totalAmount}*
on ${formattedDate}


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