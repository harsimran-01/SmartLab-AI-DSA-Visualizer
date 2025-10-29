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
    const { code, language, testCases } = await req.json();

    if (!code || !language) {
      throw new Error('Code and language are required');
    }

    // Map language names to Piston API format
    const languageMap: Record<string, { language: string; version: string }> = {
      'javascript': { language: 'javascript', version: '18.15.0' },
      'python': { language: 'python', version: '3.10.0' },
      'java': { language: 'java', version: '15.0.2' },
      'cpp': { language: 'cpp', version: '10.2.0' }
    };

    const pistonLang = languageMap[language];
    if (!pistonLang) {
      throw new Error(`Unsupported language: ${language}`);
    }

    // Execute code using Piston API
    const startTime = Date.now();
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: pistonLang.language,
        version: pistonLang.version,
        files: [{
          name: `main.${language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'js'}`,
          content: code
        }]
      })
    });

    const executionTime = Date.now() - startTime;
    const result = await response.json();

    console.log('Execution result:', result);

    // Check if execution was successful
    if (result.compile && result.compile.code !== 0) {
      return new Response(
        JSON.stringify({
          success: false,
          output: result.compile.stderr || result.compile.output,
          error: 'Compilation error',
          executionTime
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (result.run && result.run.code !== 0 && result.run.signal !== null) {
      return new Response(
        JSON.stringify({
          success: false,
          output: result.run.stderr || result.run.output,
          error: 'Runtime error',
          executionTime
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const output = result.run?.stdout || result.run?.output || '';
    
    // If test cases provided, run code for each test case
    let allTestsPassed = true;
    let testResults: any[] = [];

    if (testCases && testCases.length > 0) {
      // For now, we'll run the code once and compare output
      // In a real implementation, you'd need to modify the code to accept inputs
      for (const testCase of testCases) {
        // Parse the actual output
        const actualOutput = output.trim();
        const expectedOutput = String(testCase.expected).trim();
        
        // Check if the output contains the expected result
        const passed = actualOutput.includes(expectedOutput) || 
                      actualOutput === expectedOutput ||
                      actualOutput === `[${expectedOutput}]` ||
                      actualOutput.replace(/[\[\]\s]/g, '') === expectedOutput.replace(/[\[\]\s]/g, '');
        
        allTestsPassed = allTestsPassed && passed;
        testResults.push({
          input: testCase.input,
          expected: expectedOutput,
          actual: actualOutput,
          passed,
          description: testCase.description
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        output,
        testResults,
        allTestsPassed,
        executionTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
