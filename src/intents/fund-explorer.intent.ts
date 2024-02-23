import { Payload, Platforms, WebhookClient } from "dialogflow-fulfillment";
import { TelegramOriginalRequest } from "../interfaces/original-request.interface";
import fundCategories from "../db/fund-categories.json";
import { GoBackTo } from "../enums/go-back.enum";
import { getSession, getSessionItem, resetSession, setSessionItem } from "../services/session.service"
import { SessionKeys } from "../enums/session-keys.enum";

const fundExplorerMain = (agent: WebhookClient): Payload => {
  // resetSession(agent);
  const session = getSession(agent);
  let payload = {
    "text": `Welcome to BaraFin services.\nSomething is wrong. We are working on fixing it.\nStay tuned! fei-1`,
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": [
        [{ "text": `🔙 Main Menu 🔙`, "callback_data": GoBackTo.MainChoice }]
      ]
    }
  };

  const chooseCategoryInput = [
    "fund-explorer",
    "funds",
    "fund",
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
  ]

  const fundInputRegex = new RegExp(chooseFundInput.join("|"));

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
  } else {
  }

  if (chooseCategoryInput.includes(agent.query)) {
    payload = chooseFundCategory(agent);
    setSessionItem(SessionKeys.MainChoice, agent.query, agent);
  } else if (chooseSubCategoryInput.includes(agent.query)) {
    payload = chooseFundSubCategory(agent);
    setSessionItem(SessionKeys.FundExplorer, agent.query, agent);
  } else if (fundInputRegex.test(agent.query)) {
    payload = chooseSubCategoryFund(agent);
    setSessionItem(SessionKeys.FundSubCategory, agent.query, agent);
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

const chooseFundCategory = (agent: WebhookClient): any => {
  const categories = fundCategories.map(fc => ([{ "text": fc.name, "callback_data": fc.id }]));
  categories.push([{ "text": `🔙 Go Back`, "callback_data": GoBackTo.MainChoice }])
  return {
    "text": "These are the fund categories.\nWhich one you would like to see?",
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": categories
    }
  }
}

const chooseFundSubCategory = (agent: WebhookClient): any => {
  const category = fundCategories.find(fc => fc.id === agent.query);
  const subCategories = category?.children.map(fch => ([{ "text": fch.name, "callback_data": `${category.id}.${fch.id}` }]));
  subCategories?.push([{ "text": `🔙 Go Back`, "callback_data": GoBackTo.FundExplorer }]);

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

const chooseSubCategoryFund = (agent: WebhookClient): any => {
  const fundCategoryId = agent.query.split(".")[0];
  const fundSubCategoryId = agent.query.split(".")[1];

  const fundSubCategory = fundCategories
    .find(fc => fc.id === fundCategoryId)?.children
    .find(fch => fch.id === fundSubCategoryId);

  const allFundsInCategory = fundSubCategory?.examples.map(fch => ([{ "text": fch, "callback_data": `${fundCategoryId}.${fch.replace(/\./g, '')}` }]));
  allFundsInCategory?.push([{ "text": `🔙 Go Back`, "callback_data": GoBackTo.ChooseFunds }]);

  return {
    "text": `Which ${fundSubCategory?.name} you would like to checout?`,
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": allFundsInCategory
    }
  }
}

const fundExplorerInent = (agent: WebhookClient): void => {
  if ((agent.originalRequest as TelegramOriginalRequest).source === "telegram") {


    const telegramResponse: Payload = fundExplorerMain(agent);
    agent.add(telegramResponse);
  } else {
    agent.add(`Welcome to BaraFin services.\nSomething is wrong. We are working on fixing it.\nStay tuned! fei-2`);
  }
}

export default fundExplorerInent;