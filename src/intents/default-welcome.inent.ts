import { WebhookClient } from "dialogflow-fulfillment";
import { Events } from "../enums/events.enum";

const defaultWelcome = (agent: WebhookClient): void => {
  agent.add("telegram");
  agent.setFollowupEvent(Events.MainChoice);
};

export default defaultWelcome;