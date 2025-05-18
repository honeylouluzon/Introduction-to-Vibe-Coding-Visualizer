// llm.js - Puter.js LLM utility functions
// This module provides functions to interact with Puter.js for LLM and image generation.
// Make sure to include <script src="https://js.puter.com/v2/"></script> in your HTML before using these functions.

/**
 * Generate a chat completion using Puter.js
 * @param {string} prompt - The prompt/question to send to the LLM
 * @param {Object} [options] - Optional parameters (e.g., { model: "gpt-4o" })
 * @returns {Promise<string>} - Resolves to the LLM's response
 */
export function llmChat(prompt, options = {}) {
    return puter.ai.chat(prompt, options).then(puter.print);
}

/**
 * Generate an image using DALL-E via Puter.js
 * @param {string} prompt - The image description
 * @returns {Promise<HTMLElement>} - Resolves to an image element
 */
export function llmImage(prompt) {
    return puter.ai.txt2img(prompt);
}

/**
 * Analyze an image using GPT-4o Vision via Puter.js
 * @param {string} prompt - The question or instruction
 * @param {string} imageUrl - The URL of the image to analyze
 * @returns {Promise<string>} - Resolves to the analysis result
 */
export function llmVision(prompt, imageUrl) {
    return puter.ai.chat(prompt, imageUrl);
}

/**
 * Stream a long response from the LLM using Puter.js
 * @param {string} prompt - The prompt/question
 * @param {Object} [options] - Optional parameters (e.g., { model: "gpt-4o", stream: true })
 * @param {function(string):void} onData - Callback for each streamed part
 * @returns {Promise<void>}
 */
export async function llmChatStream(prompt, options = {}, onData) {
    const response = await puter.ai.chat(prompt, { ...options, stream: true });
    for await (const part of response) {
        onData(part?.text);
    }
}
