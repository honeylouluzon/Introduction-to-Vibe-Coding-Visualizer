// Supported models
const SUPPORTED_MODELS = {
    openai: "OpenAI",
    llama: "LLaMA",
    mistral: "Mistral",
    deepseek: "DeepSeek", // Added DeepSeek
    // Add more models as needed
};

let lastCallTime = 0;
const RATE_LIMIT = 1000; // 1 second

// Function to generate response
async function generateResponse(prompt, model) {
    const now = Date.now();
    if (now - lastCallTime < RATE_LIMIT) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT - (now - lastCallTime)));
    }
    lastCallTime = now;

    if (!SUPPORTED_MODELS[model]) {
        throw new Error(`Unsupported model: ${model}`);
    }

    const apiUrl = getApiUrlForModel(model); // Function to get API URL based on model
    const apiKey = localStorage.getItem(`${model}_api_key`); // Retrieve API key for the selected model

    if (!apiKey) {
        throw new Error(`API key for ${SUPPORTED_MODELS[model]} is missing.`);
    }

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            prompt: prompt,
            model: model,
        }),
    });

    if (!response.ok) {
        throw new Error(`Error from ${SUPPORTED_MODELS[model]}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.generated_text || data.result || "No response generated.";
}

// Helper function to get API URL for a model
function getApiUrlForModel(model) {
    switch (model) {
        case "openai":
            return "https://api.openai.com/v1/generate";
        case "llama":
            return "https://api.llama.ai/v1/generate";
        case "mistral":
            return "https://api.mistral.ai/v1/generate";
        case "deepseek":
            return "https://api.deepseek.ai/v1/generate"; // Added DeepSeek API URL
        default:
            throw new Error(`API URL not defined for model: ${model}`);
    }
}

export { generateResponse, SUPPORTED_MODELS };