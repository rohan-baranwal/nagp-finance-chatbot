import { WebhookClient } from "dialogflow-fulfillment";
import { Contexts } from "../enums/contexts.enum";

const investAmountIntent = (agent: WebhookClient): void => {
  if (agent.getContext(Contexts.InvestAmount)) {
    if (/^(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(agent.parameters.investAmount)) {
      (agent.query as any) = "invested successfully";
      agent.clearOutgoingContexts();
      agent.setContext(Contexts.Thankyou);
      agent.add("thanks");
    } else {
      agent.add(`Invalid amount. Please enter your amount in the following format: ###,###,###`);
    }
  } else {
    agent.clearOutgoingContexts();
    agent.setContext({ name: Contexts.InvestAmount, lifespan: 5 });
  }
}

export default investAmountIntent;