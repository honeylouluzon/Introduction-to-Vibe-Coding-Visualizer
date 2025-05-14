// Supported models
const SUPPORTED_MODELS = {
    openai: "OpenAI",
    llama: "LLaMA",
    mistral: "Mistral",
    deepseek: "DeepSeek", // Added DeepSeek
    // Add more models as needed
};

<<<<<<< HEAD
// Mock API responses for client-side implementation
const MOCK_RESPONSES = {
    openai: "This is a mock response from OpenAI.",
    llama: "This is a mock response from LLaMA.",
    mistral: "This is a mock response from Mistral.",
    deepseek: "This is a mock response from DeepSeek."
};

// Function to get API URL based on model
function getApiUrlForModel(model) {
    const API_URLS = {
        openai: "https://api.openai.com/v1/generate",
        llama: "https://api.llama.ai/v1/generate",
        mistral: "https://api.mistral.ai/v1/generate",
        deepseek: "https://api.deepseek.ai/v1/generate" // Added DeepSeek API URL
    };

    return API_URLS[model] || null;
}
=======
let lastCallTime = 0;
const RATE_LIMIT = 1000; // 1 second
>>>>>>> 693805eda1828fa455dfddf338d04bd2cf020607

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
    const apiKey = localStorage.getItem('apiKey'); // Retrieve API key from localStorage

    if (!apiKey) {
        throw new Error('API key is missing. Please set it in the settings menu.');
    }

    if (!apiKey) {
        throw new Error(`API key for ${SUPPORTED_MODELS[model]} is missing.`);
    }

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
<<<<<<< HEAD
    return data.response || "No response received from the API.";
=======
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
>>>>>>> 693805eda1828fa455dfddf338d04bd2cf020607
}

export { generateResponse, SUPPORTED_MODELS };