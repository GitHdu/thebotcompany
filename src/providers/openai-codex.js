/**
 * OpenAI Codex Provider - Uses OAuth tokens from ChatGPT Plus/Pro subscription
 * instead of API keys. Extends the standard OpenAI provider (same Responses API).
 */

import OpenAI from 'openai';
import { OpenAIProvider } from './openai.js';
import { getAccessToken } from '../oauth-codex.js';

export class OpenAICodexProvider extends OpenAIProvider {
  /**
   * Create an OpenAI client using the OAuth bearer token.
   * The openai SDK sends it as Authorization: Bearer <token>.
   */
  createClient({ token }) {
    return new OpenAI({ apiKey: token });
  }

  /**
   * Build request — strip the openai-codex/ prefix from the model name.
   */
  buildRequest(opts) {
    return super.buildRequest({
      ...opts,
      model: opts.model.replace(/^openai-codex\//, 'openai/'),
    });
  }

  /**
   * Codex via ChatGPT subscription has no per-token cost.
   */
  calculateCost(_usage, _model) {
    return 0;
  }
}

/**
 * Resolve a valid OAuth token for use with this provider.
 * Returns null if not authenticated.
 */
export async function resolveCodexToken() {
  return getAccessToken();
}
