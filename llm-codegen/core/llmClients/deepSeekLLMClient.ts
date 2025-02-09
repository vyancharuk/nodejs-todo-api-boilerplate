import OpenAI from 'openai';

import { DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from '../constants';
import logger from '../logger';
import { delay } from '../utils';
import { BaseLLMClient } from './baseLLMClient';

const DEEP_SEEK_BASE_URL = 'https://api.deepseek.com';
const DEEP_SEEK_CHAT_MODEL_ID = 'deepseek-chat';

/**
 * @class DeepSeek LLM client
 *
 * The DeepSeekLLMClient class interacts with DeepSeek's chat API.
 */
export class DeepSeekLLMClient extends BaseLLMClient {
  openai: OpenAI;

  constructor() {
    super();
    this.openai = new OpenAI({
      baseURL: DEEP_SEEK_BASE_URL,
      apiKey: process.env.DEEP_SEEK_API_KEY,
    });
  }

  async execute(
    prompt: string,
    maxTokens = DEFAULT_MAX_TOKENS,
    temperature = DEFAULT_TEMPERATURE,
    retry = 0
  ): Promise<{ content: string; inputTokens?: number; outputTokens?: number }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: DEEP_SEEK_CHAT_MODEL_ID,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return {
        content: completion?.choices?.[0].message?.content || '',
        inputTokens: completion.usage?.prompt_tokens,
        outputTokens: completion.usage?.completion_tokens,
      };
    } catch (ex) {
      logger.error(`DeepSeekLLMClient:execute:retry=${retry}:ex=`, ex);

      if (retry < 5) {
        // wait random seconds
        await delay(10 + Math.random() * 10);

        return this.execute(prompt, maxTokens, temperature, retry + 1);
      }

      throw ex;
    }
  }
}
