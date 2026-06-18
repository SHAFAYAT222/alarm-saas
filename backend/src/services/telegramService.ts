import fetch from 'node-fetch';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

export async function sendTelegramMessage(chatId: string, message: string): Promise<boolean> {
  if (!BOT_TOKEN) {
    console.log('[TELEGRAM] Bot token not configured. Message:', message);
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('[TELEGRAM] Failed to send message:', error);
    return false;
  }
}

export function formatAlert(monitorName: string, url: string, type: 'down' | 'up', responseTime?: number, error?: string): string {
  const emoji = type === 'down' ? '🔴' : '🟢';
  const status = type === 'down' ? 'DOWN' : 'BACK UP';

  let text = `${emoji} <b>${status}</b>\n\n`;
  text += `<b>Monitor:</b> ${monitorName}\n`;
  text += `<b>URL:</b> ${url}\n`;

  if (type === 'down' && error) {
    text += `<b>Error:</b> ${error}\n`;
  }
  if (responseTime !== undefined) {
    text += `<b>Response:</b> ${responseTime}ms\n`;
  }
  text += `<b>Time:</b> ${new Date().toISOString()}`;

  return text;
}

export async function alertDown(monitorName: string, url: string, chatId: string, error?: string): Promise<void> {
  const message = formatAlert(monitorName, url, 'down', undefined, error);
  await sendTelegramMessage(chatId, message);
}

export async function alertUp(monitorName: string, url: string, chatId: string, responseTime?: number): Promise<void> {
  const message = formatAlert(monitorName, url, 'up', responseTime);
  await sendTelegramMessage(chatId, message);
}