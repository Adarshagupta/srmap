'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COMPANIES } from '../../companies/data';
import { Problem, Example } from '../types';
import CodeEditor from '../../../../components/CodeEditor';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProblemPageProps {
  params: {
    id: string;
  };
}

export default function ProblemPage({ params }: ProblemPageProps) {
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  // Find the problem from all companies
  const problem = COMPANIES.flatMap(company => company.problems)
    .find(problem => problem.id === params.id);

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode);
    }
  }, [problem]);

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Problem Not Found</h1>
          <Link href="/dsa/problems" className="text-blue-600 hover:text-blue-800">
            Return to Problems
          </Link>
        </div>
      </div>
    );
  }

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running test cases...');

    try {
      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          problemId: params.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      if (data.success) {
        if (!data.results || !Array.isArray(data.results.testResults)) {
          throw new Error('Invalid test results format');
        }

        const { results } = data;
        let outputText = `${results.message || 'Test Results'}\n\n`;
        
        results.testResults.forEach((result: any, index: number) => {
          if (!result || typeof result !== 'object') {
            throw new Error(`Invalid test case result format for case ${index + 1}`);
          }

          outputText += `Test Case ${index + 1}:\n`;
          outputText += `Input: ${result.input || 'N/A'}\n`;
          outputText += `Expected Output: ${result.expectedOutput || 'N/A'}\n`;
          outputText += `Actual Output: ${result.actualOutput || 'N/A'}\n`;
          outputText += `Status: ${result.passed ? 'Passed ✓' : 'Failed ✗'}\n`;
          if (result.error) {
            outputText += `Error: ${result.error}\n`;
          }
          outputText += '\n';
        });

        setOutput(outputText);
      } else {
        setOutput(`Error: ${data.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setOutput(`Error running code: ${errorMessage}\n\nPlease check your code for syntax errors or try again later.`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setOutput('Submitting solution...');

    try {
      const response = await fetch('/api/code/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          problemId: params.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }
      
      if (data.success) {
        if (!data.results || typeof data.results !== 'object') {
          throw new Error('Invalid submission results format');
        }

        const { results } = data;
        let outputText = 'Solution Submission Results:\n\n';
        
        if (results.passed) {
          outputText += '✅ Solution Accepted!\n\n';
          outputText += `Runtime: ${results.runtime || 'N/A'}\n`;
          outputText += `Memory Usage: ${results.memory || 'N/A'}\n`;
          if (results.feedback) {
            outputText += `\nFeedback: ${results.feedback}\n`;
          }
        } else {
          outputText += '❌ Solution Rejected\n\n';
          if (results.failedTestCase) {
            outputText += 'Failed Test Case:\n';
            outputText += `Input: ${results.failedTestCase.input || 'N/A'}\n`;
            outputText += `Expected Output: ${results.failedTestCase.expectedOutput || 'N/A'}\n`;
            outputText += `Your Output: ${results.failedTestCase.actualOutput || 'N/A'}\n`;
          }
          if (results.error) {
            outputText += `\nError: ${results.error}\n`;
          }
        }

        setOutput(outputText);
      } else {
        setOutput(`Error: ${data.error || 'Unknown error occurred during submission'}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setOutput(`Error submitting solution: ${errorMessage}\n\nPlease try again later.`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dsa/problems" className="text-blue-600 hover:text-blue-800">
                ← Problems
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                variant="outline"
              >
                Run Code
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isRunning}
                variant="default"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{problem.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                  {problem.difficulty}
                </span>
                <span className="text-gray-500">Acceptance: {problem.acceptance}</span>
              </div>

              <Tabs defaultValue="description" className="w-full">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="hints">Hints</TabsTrigger>
                  <TabsTrigger value="solutions">Solutions</TabsTrigger>
                  <TabsTrigger value="submissions">Submissions</TabsTrigger>
                </TabsList>

                <TabsContent value="description">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">{problem.description}</p>

                    <h3 className="text-lg font-semibold mb-2">Examples:</h3>
                    {problem.examples.map((example: Example, index: number) => (
                      <div key={index} className="mb-4 bg-gray-50 p-4 rounded-md">
                        <p className="font-mono text-sm mb-2">Input: {example.input}</p>
                        <p className="font-mono text-sm mb-2">Output: {example.output}</p>
                        {example.explanation && (
                          <p className="text-sm text-gray-600">Explanation: {example.explanation}</p>
                        )}
                      </div>
                    ))}

                    <h3 className="text-lg font-semibold mb-2">Constraints:</h3>
                    <ul className="list-disc pl-6">
                      {problem.constraints.map((constraint: string, index: number) => (
                        <li key={index} className="text-gray-700">{constraint}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="hints">
                  <div className="text-gray-700">
                    <p>Hints will be available soon.</p>
                  </div>
                </TabsContent>

                <TabsContent value="solutions">
                  <div className="text-gray-700">
                    <p>Solutions will be available soon.</p>
                  </div>
                </TabsContent>

                <TabsContent value="submissions">
                  <div className="text-gray-700">
                    <p>Your submissions will appear here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Code Editor */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <CodeEditor
                value={code}
                onChange={setCode}
                language="typescript"
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>

            {output && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2">Output:</h3>
                <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                  <code>{output}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 