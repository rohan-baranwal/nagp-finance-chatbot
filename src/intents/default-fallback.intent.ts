import { WebhookClient } from "dialogflow-fulfillment";

const defaultFallback = (agent: WebhookClient): void => {
  agent.add(`I didn't get that. Can you say it again?`)
  // agent.add(`I missed what you said. What was that?`)
  // agent.add(`Sorry, could you say that again?`)
  // agent.add(`Sorry, can you say that again?`)
  // agent.add(`Can you say that again?`)
  // agent.add(`Sorry, I didn't get that. Can you rephrase?`)
  // agent.add(`Sorry, what was that?`)
  // agent.add(`One more time?`)
  // agent.add(`What was that?`)
  // agent.add(`Say that one more time?`)
  // agent.add(`I didn't get that. Can you repeat?`)
  // agent.add(`I missed that, say that again?`)
}

export default defaultFallback;