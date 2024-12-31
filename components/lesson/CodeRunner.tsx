'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Play, CheckCircle, XCircle } from 'lucide-react';
import { TestCase } from '@/app/dsa/content';

interface CodeRunnerProps {
  code: string;
  language: 'python' | 'cpp' | 'java';
  testCases: TestCase[];
}

interface TestResult {
  status: 'success' | 'error';
  output?: string;
  error?: string;
  time?: number;
  memory?: number;
}

export function CodeRunner({ code, language, testCases }: CodeRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('console');
  const [results, setResults] = useState<TestResult[]>([]);

  const runCode = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // TODO: Implement actual code execution
      // This is a mock implementation
      const mockResults = testCases.map((testCase, index) => ({
        status: Math.random() > 0.5 ? 'success' : 'error',
        output: Math.random() > 0.5 ? testCase.output[0] : 'Wrong answer',
        time: Math.random() * 100,
        memory: Math.random() * 16,
      })) as TestResult[];

      setResults(mockResults);
    } catch (error) {
      setResults([
        {
          status: 'error',
          error: error instanceof Error ? error.message : 'An error occurred',
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="ml-auto"
          >
            {isRunning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Run Code
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border-b border-slate-200">
            <TabsList>
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="testcases">Test Cases</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <TabsContent value="console">
              {results.length === 0 ? (
                <div className="text-slate-500 text-center mt-4">
                  Click "Run Code" to see the output
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="space-y-2">
                      {result.status === 'success' ? (
                        <>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Test Case {index + 1} Passed
                          </div>
                          <div className="text-sm text-slate-600">
                            Time: {result.time?.toFixed(2)}ms | Memory: {result.memory?.toFixed(2)}MB
                          </div>
                          <pre className="bg-slate-50 p-3 rounded-lg text-sm">
                            {result.output}
                          </pre>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center text-red-600">
                            <XCircle className="h-5 w-5 mr-2" />
                            Test Case {index + 1} Failed
                          </div>
                          <pre className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {result.error || result.output}
                          </pre>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="testcases">
              <div className="space-y-4">
                {testCases.map((testCase, index) => (
                  <Card key={index} className="p-4">
                    <div className="font-medium mb-2">Test Case {index + 1}</div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-slate-500">Input:</span>
                        <pre className="mt-1 bg-slate-50 p-2 rounded text-sm">
                          {testCase.input.join('\n')}
                        </pre>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-500">Expected Output:</span>
                        <pre className="mt-1 bg-slate-50 p-2 rounded text-sm">
                          {testCase.output.join('\n')}
                        </pre>
                      </div>
                      {results[index] && (
                        <div>
                          <span className="text-sm font-medium text-slate-500">Your Output:</span>
                          <pre className={`mt-1 p-2 rounded text-sm ${
                            results[index].status === 'success'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {results[index].output || results[index].error}
                          </pre>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 