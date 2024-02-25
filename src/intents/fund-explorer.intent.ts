import { Payload, Platforms, WebhookClient } from "dialogflow-fulfillment";
import { TelegramOriginalRequest } from "../interfaces/original-request.interface";
import fundCategories from "../db/fund-categories.json";
import { GoBackTo } from "../enums/go-back.enum";
import { SessionType, getSession, getSessionItem, resetSession, setSessionItem } from "../services/session.service"
import { SessionKeys } from "../enums/session-keys.enum";
import { Contexts } from "../enums/contexts.enum";

const fundExplorerMain = (agent: WebhookClient): Payload => {
  const session = getSession(agent);
  let payload = {
    "text": `Welcome to BaraFin services.\nSomething is wrong. We are working on fixing it.\nStay tuned!
ERROR: fundExplorerMain.1
    `,
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": [
        [{ "text": `🔙 Main Menu 🔙`, "callback_data": GoBackTo.MainMenu }]
      ]
    }
  };

  const chooseCategoryInput = [
    "fund-explorer",
    "explorer",
    GoBackTo.FundExplorer
  ];

  const chooseSubCategoryInput = [
    "equity-funds",
    "debt-funds",
    "hybrid-funds",
    "index-funds",
    GoBackTo.FundSubCategory
  ];

  const chooseFundInput = [
    "large-cap",
    "mid-cap",
    "small-cap",
    "liquid-funds",
    "income-funds",
    "gilt-funds",
    "balanced-funds",
    "arbitrage-funds",
    GoBackTo.ChooseFunds
  ];

  const catetoryInputRegex = new RegExp(chooseCategoryInput.join("|"));
  const subCatetoryInputRegex = new RegExp(chooseSubCategoryInput.join("|"));
  const fundInputRegex = new RegExp(chooseFundInput.join("|"));
  const selectedFundRegex = new RegExp("selected-fund\.");
  const investMoreRegex = new RegExp("\.invest-in\.");

  // checking if user wants to go back in menu
  if (Object.values(GoBackTo).includes(agent.query as GoBackTo)) {
    let targetEnum = "";
    let sessionQuery = "hi";
    const enumKeys = Object.keys(GoBackTo);
    for (const key of enumKeys) {
      if (GoBackTo[key as keyof typeof GoBackTo] === agent.query) {
        targetEnum = key;
      }
    }
    if (targetEnum) {
      sessionQuery = getSessionItem(SessionKeys[targetEnum as keyof typeof SessionKeys], agent);
    }
    (agent.query as any) = sessionQuery;
  }

  // checking user is where and redirecting accordingly
  if (catetoryInputRegex.test(agent.query)) {
    payload = chooseFundCategory(agent, session);
    setSessionItem(SessionKeys.MainChoice, agent.query, agent, true);
  } else if (subCatetoryInputRegex.test(agent.query)) {
    payload = chooseFundSubCategory(agent, session);
    setSessionItem(SessionKeys.FundExplorer, agent.query, agent, true);
  } else if (fundInputRegex.test(agent.query)) {
    payload = chooseSubCategoryFund(agent, session);
    setSessionItem(SessionKeys.FundSubCategory, agent.query, agent, true);
  } else if (selectedFundRegex.test(agent.query)) {
    payload = chooseSelectedFundOption(agent, session);
    setSessionItem(SessionKeys.ChooseFunds, agent.query, agent, true);
  } else if (investMoreRegex.test(agent.query)) {
    agent.clearContext(Contexts.FundExplorer);
    agent.setContext(Contexts.PhoneNumber);
    payload = chooseInvestInFund(agent, session);
    setSessionItem(SessionKeys.InvestMore, agent.query, agent, true);
  }

  return new Payload(
    "TELEGRAM" as Platforms,
    payload,
    {
      rawPayload: false,
      sendAsMessage: true
    }
  )
}

const chooseFundCategory = (agent: WebhookClient, session?: SessionType): any => {
  const categories = fundCategories.map(fc => ([{ "text": fc.name, "callback_data": `${fc.id}` }]));
  categories.push([{ "text": `🔙 Go Back`, "callback_data": GoBackTo.MainMenu }])
  return {
    "text": "These are the fund categories.\nWhich one you would like to see?",
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": categories
    }
  }
}

const chooseFundSubCategory = (agent: WebhookClient, session?: SessionType): any => {
  const category = fundCategories.find(fc => fc.id === agent.query);
  const subCategories = category?.children.map(fch => ([{ "text": fch.name, "callback_data": `${fch.id}` }]));
  subCategories?.push([{ "text": `🔙 Go Back`, "callback_data": GoBackTo.MainChoice }]);

  if (!subCategories?.length) {
    return {
      "text": `Couldn't find any sub-categories in this fund.\nPlease start again.`,
      "parse_mode": "Markdown"
    }
  }
  return {
    "text": `Which ${category?.name} you would like to see?`,
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": subCategories
    }
  }
}

const chooseSubCategoryFund = (agent: WebhookClient, session?: SessionType): any => {
  const fundCategoryId = session?.sessionStack[session.sessionStack.length - 1] ?? 'FE.debt-funds';
  const fundSubCategoryId = agent.query;//.split(".")[1];

  const fundSubCategory = fundCategories
    .find(fc => fc.id === fundCategoryId)?.children
    .find(fch => fch.id === fundSubCategoryId) ?? fundCategories[1].children[2];

  const allFundsInCategory = fundSubCategory?.examples.map(fch => ([{ "text": fch, "callback_data": `FE.selected-fund.${fch.replace(/\./g, '')}` }]));
  allFundsInCategory?.push([{ "text": `🔙 Go Back`, "callback_data": GoBackTo.FundExplorer }]);

  return {
    "text": `Which ${fundSubCategory?.name} you would like to checkout?`,
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": allFundsInCategory
    }
  }
}

const chooseSelectedFundOption = (agent: WebhookClient, session?: SessionType): any => {
  const selectedFund = agent.query.split(".").pop();
  return {
    "text": `
    *${selectedFund}:*\n
This is a dynamic asset allocation fund, investing in both equity (30-80%) and debt (20-70%) based on market outlook. It aims for balanced returns across market conditions while managing risk. Think of it as a flexible basket adapting to market swings, offering moderate growth potential with some stability.\n
More details: [https://www.youtube.com/watch?v=dQw4w9WgXcQ](${selectedFund})
    `,
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": [
        [
          {
            "text": `Invest in ${selectedFund}`,
            "callback_data": `FE.invest-in.${selectedFund}`
          }
        ],
        [{ "text": `🔙 Go Back`, "callback_data": GoBackTo.FundSubCategory }],
        [{ "text": `🔙 Main Menu 🔙`, "callback_data": GoBackTo.MainMenu }]
      ]
    }
  };
}

const chooseInvestInFund = (agent: WebhookClient, session?: SessionType): any => {
  return {
    "text": "Enter registered phone number",
    "parse_mode": "Markdown"
  }
}

const fundExplorerInent = (agent: WebhookClient): void => {
  if ((agent.originalRequest as TelegramOriginalRequest).source === "telegram") {
    const telegramResponse: Payload = fundExplorerMain(agent);
    agent.add(telegramResponse);
  } else {
    agent.add(`Welcome to BaraFin services.\nSomething is wrong. We are working on fixing it.\nStay tuned!\nERROR: fundExplorerMain.2`);
  }
}

export default fundExplorerInent;