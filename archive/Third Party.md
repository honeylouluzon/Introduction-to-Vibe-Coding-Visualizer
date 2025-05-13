# Third-Party API Integration Guide

This guide explains how to integrate third-party public APIs into the Hybrid Intelligence Playground application.

## Table of Contents
- [Overview](#overview)
- [Supported APIs](#supported-apis)
- [Integration Process](#integration-process)
- [API Categories](#api-categories)
- [Implementation Details](#implementation-details)
- [Best Practices](#best-practices)

## Overview

The Hybrid Intelligence Playground supports integration with various public APIs to enhance its capabilities. The application provides a modular system for adding and managing API connections, with built-in support for multiple categories of services.

## Supported APIs

The application currently supports the following categories of APIs:

### Art & Design
- **COLOURlovers**: Color trends and palettes
- **Image-Charts**: Generate chart images
- **QuickChart**: Dynamic chart generation

### Content
- **WordPress**: Public WordPress posts
- **Wikipedia**: Article search and content
- **OpenStreetMap**: Location data

### Developer Tools
- **Image-Charts**: Chart generation
- **QuickChart**: Dynamic chart creation

### Food & Drink
- **Cocktail DB**: Cocktail recipes
- **Spoonacular**: Food and recipe data

### Fun & Games
- **Board Game Geek**: Board game database
- **FreeToGame**: Free-to-play games
- **Gamerpower**: Game giveaways
- **Imgflip**: Popular memes
- **Official Joke**: Random jokes

### Inspiration
- **Affirmations**: Daily affirmations
- **Dictum**: Inspiring quotes
- **Kanye Quotes**: Kanye West quotes

### Language
- **Free Dictionary**: Word definitions

### Science
- **Newton**: Advanced mathematics
- **Numbers**: Number facts

### Weather
- **Open-Meteo**: Weather forecasts

## Integration Process

### 1. Adding a New API

To add a new API to the application:

1. Create a new API handler function in `app.js`:
```javascript
async function fetchNewApiData(query) {
    try {
        const response = await fetch(`https://api.example.com/endpoint?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        return {
            success: true,
            data: data.map(item => ({
                id: item.id,
                title: item.title,
                preview: item.description,
                metadata: item.additionalInfo,
                platform: 'newapi'
            }))
        };
    } catch (error) {
        console.error('New API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
```

2. Add the API to the `apiHandlers` object:
```javascript
const apiHandlers = {
    // ... existing handlers
    newapi: fetchNewApiData
};
```

### 2. Adding API Configuration

Add the API configuration to the connections modal in `index.html`:

```html
<div class="connection-item" data-category="your-category">
    <div class="connection-info">
        <i class="fas fa-icon"></i>
        <span class="platform-name">Your API Name</span>
        <span class="api-description">Brief description</span>
        <span class="connection-status not-connected">Disabled</span>
    </div>
    <label class="toggle-switch">
        <input type="checkbox" class="api-toggle" data-api="newapi">
        <span class="toggle-slider"></span>
    </label>
</div>
```

### 3. Implementing API Testing

Add API testing functionality in the `testApiConnection` method:

```javascript
async testApiConnection(api) {
    const endpoints = {
        // ... existing endpoints
        newapi: {
            url: 'https://api.example.com/test',
            params: {
                // Test parameters
            }
        }
    };
    // ... rest of the implementation
}
```

## API Categories

### Public APIs (No Authentication Required)
- Wikipedia
- OpenStreetMap
- Health Data
- Crypto Data
- Weather Data
- Dictionary API
- Numbers API

### APIs Requiring API Keys
- OpenAI
- Anthropic
- Google AI
- Deepseek
- Groq
- Mistral

## Implementation Details

### API Response Format

All API handlers should return data in the following format:

```javascript
{
    success: boolean,
    data: [
        {
            id: string,
            title: string,
            preview: string,
            metadata: string,
            platform: string
        }
    ],
    error?: string
}
```

### Error Handling

Implement proper error handling for API calls:

```javascript
try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Process response
} catch (error) {
    console.error('API Error:', error);
    return {
        success: false,
        error: error.message
    };
}
```

### Rate Limiting

Consider implementing rate limiting for API calls:

```javascript
const rateLimiter = {
    lastCall: 0,
    minInterval: 1000, // 1 second

    async wait() {
        const now = Date.now();
        const timeToWait = Math.max(0, this.minInterval - (now - this.lastCall));
        if (timeToWait > 0) {
            await new Promise(resolve => setTimeout(resolve, timeToWait));
        }
        this.lastCall = Date.now();
    }
};
```

## Best Practices

1. **Error Handling**
   - Always implement proper error handling
   - Provide meaningful error messages
   - Handle network failures gracefully

2. **Rate Limiting**
   - Implement rate limiting for API calls
   - Cache responses when appropriate
   - Use exponential backoff for retries

3. **Security**
   - Never expose API keys in client-side code
   - Use environment variables for sensitive data
   - Implement proper CORS policies

4. **Performance**
   - Cache API responses when possible
   - Implement request debouncing
   - Use pagination for large datasets

5. **User Experience**
   - Show loading states during API calls
   - Provide clear error messages
   - Implement retry mechanisms

6. **Testing**
   - Test API integration thoroughly
   - Mock API responses for testing
   - Implement proper error scenarios

## Example Implementation

Here's a complete example of implementing a new API:

```javascript
// API Handler
async function fetchExampleApiData(query) {
    try {
        await rateLimiter.wait();
        
        const response = await fetch(`https://api.example.com/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return {
            success: true,
            data: data.items.map(item => ({
                id: item.id,
                title: item.title,
                preview: item.description,
                metadata: `Last updated: ${new Date(item.updated).toLocaleDateString()}`,
                platform: 'example'
            }))
        };
    } catch (error) {
        console.error('Example API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Add to API handlers
apiHandlers.example = fetchExampleApiData;

// Add to test endpoints
const endpoints = {
    // ... existing endpoints
    example: {
        url: 'https://api.example.com/test',
        params: {
            test: true
        }
    }
};
```

## Contributing

When adding new APIs to the application:

1. Follow the established code structure
2. Implement proper error handling
3. Add appropriate documentation
4. Test thoroughly
5. Consider rate limiting and caching
6. Follow security best practices

## Support

For questions or issues regarding API integration, please:

1. Check the existing documentation
2. Review the code examples
3. Test the API endpoints
4. Contact the development team

Remember to always respect API terms of service and implement proper error handling and rate limiting for all integrations. 