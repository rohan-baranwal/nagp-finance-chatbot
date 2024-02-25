import { Payload, Platforms, WebhookClient } from "dialogflow-fulfillment";
import { Contexts } from "../enums/contexts.enum";
import { getSession, getSessionItem, setSessionItem } from "../services/session.service";
import { SessionKeys } from "../enums/session-keys.enum";

const phoneNumberInent = (agent: WebhookClient): void => {
  const context = agent.getContext(Contexts.PhoneNumber);
  const session = getSession(agent);

  if (context) {
    const phoneNumber = agent.parameters["phone-number"];
    const isValidPhoneNumber = /^\d{10}$/.test(phoneNumber);

    if (isValidPhoneNumber) {

      agent.add(`Your phone number is ${phoneNumber}.`);
      setSessionItem(SessionKeys.PhoneNumber, phoneNumber, agent, true);
      const lastAction = getSessionItem(SessionKeys.LastAction, agent);
      if (lastAction?.length) {
        if (/FE\.invest-in\./.test(lastAction)) {
          (agent.query as any) = "INVAMT";
          agent.setContext(Contexts.InvestAmount);
          agent.add(`How much Gandhi would you like to invest?`);
        } else if (/PV\.portfolio-valuation/.test(lastAction)) {
          (agent.query as any) = "PV.show-portfolio";
          agent.setContext(Contexts.PortfolioValuation);
          agent.add(new Payload(
            "TELEGRAM" as Platforms,
            {
              "text": `Getting your Portfolio...`,
              "parse_mode": "Markdown"
            },
            {
              rawPayload: false,
              sendAsMessage: true
            }
          ));
          // agent.add();
        } else {
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
      } else {
        agent.clearOutgoingContexts();
        agent.setContext(Contexts.PhoneNumber);
      }
    } else {
      if (getSessionItem(SessionKeys.LastAction, agent)?.length) {
        agent.clearOutgoingContexts();
        agent.setContext(Contexts.Thankyou);
        agent.add(`Thankyou for using our services. Say "hi" to start again.`);
      } else {
        agent.add(`Invalid phone number. Please enter your phone number in the following format: ###-###-####`);
      }
    }
  } else {
    agent.add(`Please provide your phone number.`);

    // Set the phone-number-context.
    agent.setContext({
      name: Contexts.PhoneNumber,
      lifespan: 5
    });
  }
}

export default phoneNumberInent;