import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { transcript, context } = await req.json();

    // Mock Mode if API Key is missing
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_key_here') {
      console.log('Mocking Claude Response for:', transcript);
      let mockAnalysis = {
        action: 'check',
        zone: 'field1',
        updates: { soilMoisture: 45 },
        alerts: [],
        task: null
      };

      if (transcript.toLowerCase().includes('barn')) {
        mockAnalysis.zone = 'barn';
        mockAnalysis.updates = { temperature: 28 };
      } else if (transcript.toLowerCase().includes('alert') || transcript.toLowerCase().includes('problem')) {
        mockAnalysis.alerts = ['field1'];
      }

      return Response.json(mockAnalysis);
    }

    // Use a valid model name
    const modelName = 'claude-3-5-sonnet-latest';

    const message = await anthropic.messages.create({
      model: modelName,
      max_tokens: 1024,
      system: `You are an AI assistant analyzing voice input from a smart farm monitoring system.
      
Context: ${context}

When you receive a voice transcript, analyze it and return a JSON response with:
1. "action" - what the farmer wants to do (check, update, alert, etc)
2. "zone" - which farm zone they're referring to (field1, barn, greenhouse, storage)
3. "updates" - any data updates to apply (temperature, moisture, etc)
4. "alerts" - any new alerts to create (list of zone IDs)
5. "task" - if they want to create a task, describe it

Current zones: field1 (North Field), barn (Main Barn), greenhouse, storage.

Example input: "Check soil moisture in north field"
Example output: {
  "action": "check",
  "zone": "field1",
  "updates": {},
  "alerts": [],
  "task": null
}

Always respond with valid JSON only, no markdown.`,
      messages: [
        {
          role: 'user',
          content: transcript
        }
      ]
    });

    // Parse Claude's response
    const responseText = message.content[0].text;
    console.log('Claude Response:', responseText);
    
    let analysis;
    try {
      // Find JSON block if it exists or parse directly
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      const jsonStr = responseText.substring(jsonStart, jsonEnd);
      analysis = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse Claude JSON:', e);
      analysis = {
        action: 'unknown',
        zone: null,
        updates: {},
        alerts: [],
        task: null
      };
    }

    return Response.json(analysis);
  } catch (error) {
    console.error('Claude API error:', error);
    return Response.json(
      { error: 'Failed to process voice input' },
      { status: 500 }
    );
  }
}
