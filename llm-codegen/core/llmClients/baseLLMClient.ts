/**
 * @abstract
 * @class BaseLLMClient
 *
 * The BaseLLMClient abstract class defines a standardized interface for interacting with
 * various LLM providers.
 */
export abstract class BaseLLMClient {
  abstract execute(
    prompt: string,
    maxTokens?: number,
    temperature?: number,
    retry?: number
  ): Promise<{ content: string; inputTokens?: number; outputTokens?: number }>;
}
