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
    const { code, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
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
          {
            role: 'system',
            content: `You are an expert code analyzer. Analyze the provided ${language} code and return a JSON response with three sections:
            1. explanation: What the code does, its purpose, and how it works
            2. errors: Potential bugs, logical errors, edge cases not handled, or syntax issues
            3. optimization: How the code can be improved for better performance, readability, or best practices
            
            Keep each section concise (2-3 sentences). Be specific and actionable.`
          },
          {
            role: 'user',
            content: `Analyze this ${language} code:\n\n${code}`
          }
        ],
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse the response to extract sections
    const explanationMatch = aiResponse.match(/explanation[:\s]+(.+?)(?=errors|optimization|$)/is);
    const errorsMatch = aiResponse.match(/errors[:\s]+(.+?)(?=optimization|$)/is);
    const optimizationMatch = aiResponse.match(/optimization[:\s]+(.+?)$/is);

    return new Response(
      JSON.stringify({
        explanation: explanationMatch ? explanationMatch[1].trim() : aiResponse,
        errors: errorsMatch ? errorsMatch[1].trim() : 'No obvious errors detected.',
        optimization: optimizationMatch ? optimizationMatch[1].trim() : 'Code looks good!',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
