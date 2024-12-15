import OpenAI from 'openai';

import { DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from '../constants';
import logger from '../logger';
import { delay } from '../utils';
import { BaseLLMClient } from './baseLLMClient';

const { OPENAI_MODEL_ID = 'gpt-4o-mini' } = process.env;

/**
 * @class OpenAILLMClient
 *
 * The OpenAILLMClient class interacts with OpenAI's LLM API.
 * It sends prompts to the specified OpenAI model and retrieves the generated responses.
 * The client includes retry logic to handle transient server errors, ensuring reliable communication with the API.
 */
export class OpenAILLMClient extends BaseLLMClient {
  openai: OpenAI;

  constructor() {
    super();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async execute(
    prompt: string,
    maxTokens = DEFAULT_MAX_TOKENS,
    temperature = DEFAULT_TEMPERATURE,
    retry = 0
  ): Promise<{ content: string; inputTokens?: number; outputTokens?: number }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: OPENAI_MODEL_ID,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
      });

      return {
        content: response.choices[0].message.content || '',
        inputTokens: response.usage?.prompt_tokens,
        outputTokens: response.usage?.completion_tokens,
      };
    } catch (ex) {
      logger.error(`OpenAILLMClient:execute:retry=${retry}:ex=`, ex);
      if (
        retry < 5 &&
        ex instanceof OpenAI.APIError &&
        Number(ex.status || 0) >= 500
      ) {
        logger.error(
          `OpenAILLMClient:RETRY:error=`,
          ex.status,
          ex.name,
          'retry=',
          retry
        );
        // wait random seconds
        await delay(10 + Math.random() * 10);

        return this.execute(prompt, maxTokens, temperature, retry + 1);
      }

      throw ex;
    }
  }
}
