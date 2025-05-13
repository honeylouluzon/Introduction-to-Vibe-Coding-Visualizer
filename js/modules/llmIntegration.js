export async function generateResponse({ prompt, model }) {
    const apiKey = localStorage.getItem('apiKey');
    const response = await fetch('https://api.llmprovider.com/v1/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ prompt, model })
    });
    const data = await response.json();
    return data.text;
}