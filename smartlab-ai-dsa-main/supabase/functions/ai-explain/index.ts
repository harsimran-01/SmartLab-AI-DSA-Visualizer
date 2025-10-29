import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dataStructure, operation, value, currentState, details } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    let prompt = '';
    if (dataStructure === 'stack') {
      prompt = `Explain in simple terms: A stack (LIFO) operation where we ${operation} the value "${value}". Current stack: [${currentState}]. Keep it under 3 sentences.`;
    } else if (dataStructure === 'queue') {
      prompt = `Explain in simple terms: A queue (FIFO) operation where we ${operation} the value "${value}". Current queue: [${currentState}]. Keep it under 3 sentences.`;
    } else if (dataStructure === 'sorting') {
      prompt = `Explain why we swapped elements at positions ${details.index1} and ${details.index2} (values ${details.value1} and ${details.value2}) in bubble sort. Keep it under 2 sentences.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a helpful DSA tutor. Explain concepts simply for beginners.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const explanation = data.choices[0].message.content;

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
