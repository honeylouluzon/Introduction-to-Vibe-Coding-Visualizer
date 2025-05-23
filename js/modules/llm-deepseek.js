// llm-deepseek.js
// Integration for DeepSeek LLM using API Key from user input
// This file is loaded only if the user selects DeepSeek and provides an API key.

/**
 * Generate a chat completion using DeepSeek API (example endpoint, adjust as needed)
 * @param {string} prompt - The prompt/question to send to the LLM
 * @param {Object} [options] - Optional parameters (e.g., { model: "deepseek", apiKey: "..." })
 * @returns {Promise<string>} - Resolves to the LLM's response
 */
export async function llmChat(prompt, options = {}) {
    const apiKey = options.apiKey;
    const model = options.model || "deepseek";
    if (!apiKey) throw new Error("DeepSeek API key is required");
    // Example endpoint for DeepSeek API (replace with actual endpoint if different)
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
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
    if (!response.ok) throw new Error("DeepSeek API error");
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}
