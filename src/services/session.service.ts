import { WebhookClient } from "dialogflow-fulfillment";

type SessionType = {
  id: string,
  sessionStack: string[],
  [key: string]: any
}

const sessions: SessionType[] = [];

const getSession = (agent: WebhookClient): SessionType => {
  const agentSessionId = agent.session.split("/").pop() ?? "";
  let currentSession = sessions.find(se => se.id === agentSessionId);
  if (!currentSession) {
    currentSession = {
      id: agentSessionId,
      sessionStack: []
    }
    sessions.push(currentSession);
  }
  return currentSession;
};

const setSessionItem = (key: string, value: string, agent: WebhookClient): void => {
  const currentSession = getSession(agent);
  currentSession[key] = value;
  currentSession["sessionStack"].push(value);
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