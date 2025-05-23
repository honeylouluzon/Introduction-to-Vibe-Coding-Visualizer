// llm-openAI.js
// Integration for OpenAI LLM using API Key from user input
// This file is loaded only if the user selects OpenAI (e.g., GPT-4o, GPT-3.5 Turbo) and provides an API key.

/**
 * Generate a chat completion using OpenAI API
 * @param {string} prompt - The prompt/question to send to the LLM
 * @param {Object} [options] - Optional parameters (e.g., { model: "gpt-4o", apiKey: "..." })
 * @returns {Promise<string>} - Resolves to the LLM's response
 */
export async function llmChat(prompt, options = {}) {
    const apiKey = options.apiKey;
    const model = options.model || "gpt-3.5-turbo";
    if (!apiKey) throw new Error("OpenAI API key is required");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 512
        })
    });
    if (!response.ok) throw new Error("OpenAI API error");
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}
