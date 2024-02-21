import express, { json } from "express";
import { WebhookClient } from "dialogflow-fulfillment";

const app = express();

app.get('/', (req, res) => res.send('server online'));
app.post(`/dialogflow`, json(), (req, res) => {
  
});