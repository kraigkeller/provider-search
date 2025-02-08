const path = require('path');
const providers = require('./providers.json');
const zipCodeToCounty = {
  '19104': ['Philadelphia County'],
  '15213': ['Allegheny County'],
  '19428': ['Montgomery County'],
  '19057': ['Bucks County'],
  '19382': ['Chester County']
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,POST"
      },
      body: null
    };
  }

  try {
    if (!event?.body) {
      throw new Error('Request body is missing.');
    }
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (parseErr) {
      throw new Error('Malformed JSON in request body.');
    }
    const filters = body?.variables?.filters;
    if (!filters) {
      throw new Error('Missing required filters.');
    }

    let filteredProviders = providers;

    if (filters.zipCode) {
      const counties = zipCodeToCounty[filters.zipCode] || [];
      filteredProviders = filteredProviders.filter(provider =>
        counties.includes(provider.location.county)
      );
    }

    if (filters.county) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.location.county === filters.county
      );
    }

    if (filters.specialty) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }

    if (filters.name) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        data: {
          searchProviders: filteredProviders
        }
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: error.statusCode || 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
      })
    };
  }
};