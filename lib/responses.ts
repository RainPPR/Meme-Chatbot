/**
 * 梗式 AI 响应池及动态生成规则
 * 用户可在此数组中轻松追加新的响应字符串或动态生成函数。
 */

export interface ResponseContext {
  now: Date;
}

export type ResponseGenerator = string | ((ctx: ResponseContext) => string);

/**
 * 获取用户本地日期 >= 8 天后的第一个周五，格式如：6月26日（周五）
 */
export function getNextFridayAfter8Days(from: Date = new Date()): string {
  const target = new Date(from.getTime());
  // 至少增加8天
  target.setDate(target.getDate() + 8);

  // 获取增加8天后的星期几 (0: 周日, 1: 周一, ..., 5: 周五, 6: 周六)
  const day = target.getDay();
  const daysUntilFriday = (5 - day + 7) % 7;
  target.setDate(target.getDate() + daysUntilFriday);

  const month = target.getMonth() + 1;
  const date = target.getDate();
  return `${month}月${date}日（周五）`;
}

/**
 * 预设响应列表
 * 支持纯字符串或基于上下文的动态函数
 */
export const MEME_RESPONSES: ResponseGenerator[] = [
  'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.',
  '你好，这个问题我暂时无法回答，让我们换个话题再聊聊吧。',
  'Too many people are chatting with Kimi right now. Subscribe to enter a dedicated priority queue!',
  ({ now }) => {
    const fridayStr = getNextFridayAfter8Days(now);
    return `尊敬的用户，因您当前账号认证信息对应未成年人身份，根据实名认证管理要求，您的实名认证状态将于${fridayStr}失效。请在失效后及时登录平台，使用符合要求的身份信息完成实名认证。若无有效实名认证，平台 API 调用及相关功能将暂时无法使用。感谢您的支持和理解。 如有疑问，可通过工单联系客服。`;
  },
];

/**
 * 随机选取并生成一条回复
 */
export function getRandomMemeResponse(): string {
  if (MEME_RESPONSES.length === 0) {
    return '...';
  }
  const index = Math.floor(Math.random() * MEME_RESPONSES.length);
  const selected = MEME_RESPONSES[index];
  const now = new Date();

  if (typeof selected === 'function') {
    return selected({ now });
  }
  return selected;
}

/**
 * 获取随机思考时间 (0.5 ~ 1.5 秒，即 500 ~ 1500 毫秒)
 */
export function getRandomThinkingDelay(): number {
  return Math.floor(Math.random() * 1000) + 500;
}
