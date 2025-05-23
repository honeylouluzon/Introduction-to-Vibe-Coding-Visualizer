// llm-integrations.js
// Unified LLM integrations for OpenAI, Llama, DeepSeek, and Mistral
// Keeps llm.js as the default. Use these functions for API-key-based LLMs.

/**
 * Generic chat completion for supported LLM providers
 * @param {string} provider - One of: 'openai', 'llama', 'deepseek', 'mistral'
 * @param {string} prompt - The prompt/question to send to the LLM
 * @param {Object} [options] - { model, apiKey }
 * @returns {Promise<string>} - Resolves to the LLM's response
 */
export async function llmChatProvider(provider, prompt, options = {}) {
    const apiKey = options.apiKey;
    let model, url;
    let headers = { "Content-Type": "application/json" };
    let body;
    switch (provider) {
        case 'openai':
            model = options.model || "gpt-3.5-turbo";
            url = "https://api.openai.com/v1/chat/completions";
            headers["Authorization"] = `Bearer ${apiKey}`;
            body = JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 512
            });
            if (!apiKey) throw new Error("OpenAI API key is required");
            break;
        case 'llama':
            model = options.model || "llama-3";
            url = "https://api.llama.ai/v1/chat/completions";
            headers["Authorization"] = `Bearer ${apiKey}`;
            body = JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 512
            });
            if (!apiKey) throw new Error("Llama API key is required");
            break;
        case 'deepseek':
            model = options.model || "deepseek";
            url = "https://api.deepseek.com/v1/chat/completions";
            headers["Authorization"] = `Bearer ${apiKey}`;
            body = JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 512
            });
            if (!apiKey) throw new Error("DeepSeek API key is required");
            break;
        case 'mistral':
            model = options.model || "mixtral-8x7b";
            url = "https://api.mistral.ai/v1/chat/completions";
            headers["Authorization"] = `Bearer ${apiKey}`;
            body = JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 512
            });
            if (!apiKey) throw new Error("Mistral API key is required");
            break;
        default:
            throw new Error("Unsupported LLM provider");
    }
    const response = await fetch(url, {
        method: "POST",
        headers,
        body
    });
    if (!response.ok) throw new Error(`${provider} API error`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}
