import { WebhookClient } from "dialogflow-fulfillment";

type SessionType = {
  id: string,
  [key: string]: string
}

const sessions: SessionType[] = [];

const getSession = (agent: WebhookClient): SessionType => {
  const agentSessionId = agent.session.split("/").pop() ?? "";
  let currentSession = sessions.find(se => se.id === agentSessionId);
  if (!currentSession) {
    currentSession = {
      id: agentSessionId
    }
    sessions.push(currentSession);
  }
  console.log(currentSession);
  return currentSession;
};

const setSessionItem = (key: string, value: string, agent: WebhookClient): void => {
  getSession(agent)[key] = value;
}

const getSessionItem = (key: string, agent: WebhookClient): string => {
  return getSession(agent)[key] ?? "";
}
const resetSession = (agent: WebhookClient): void => {
  const sessionIndex = sessions.findIndex(se => se.id === getSession(agent).id);
  sessions.splice(sessionIndex, 1);
  getSession(agent);
}

export { getSession, setSessionItem, getSessionItem, resetSession, SessionType }