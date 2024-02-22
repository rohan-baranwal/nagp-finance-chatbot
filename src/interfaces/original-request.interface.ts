export interface TelegramOriginalRequest {
  payload: {
    data: {
      chat: { id: string, type: string },
      date: string,
      from: { id: string, first_name: string, language_code: string, username: string },
      message_id: string,
      text: string,
    },
  },
  source: 'telegram' | string;
}