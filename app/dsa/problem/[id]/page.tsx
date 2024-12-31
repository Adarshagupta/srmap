"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeEditor } from '@/components/code-editor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Timer, TrendingUp } from 'lucide-react';

interface ProblemProps {
  params: {
    id: string;
  };
}

export default function ProblemPage({ params }: ProblemProps) {
  const [selectedTab, setSelectedTab] = useState('description');

  // This would come from your database in a real app
  const problem = {
    id: params.id,
    title: 'Two Sum',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.
    
You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
}`,
      java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
}`,
      python: `def twoSum(nums: List[int], target: int) -> List[int]:
    # Your code here`
    }
  };

  const handleRunCode = (code: string) => {
    // In a real app, this would send the code to a backend for compilation and testing
    console.log('Running code:', code);
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'default';
      case 'Medium':
        return 'secondary';
      case 'Hard':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="max-w-[100rem] mx-auto py-4 px-2 space-y-6">
      {/* Problem Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <div className="flex items-center gap-4">
            <Badge variant={getDifficultyVariant(problem.difficulty)}>
              {problem.difficulty}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span>{problem.timeComplexity}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>{problem.spaceComplexity}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className="space-y-4">
          <Card className="p-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="constraints">Constraints</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{problem.description}</p>
                </div>
              </TabsContent>
              <TabsContent value="examples" className="mt-4 space-y-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="space-y-2">
                    <div className="font-medium">Example {index + 1}:</div>
                    <div className="bg-muted p-3 rounded-lg space-y-2">
                      <div><span className="font-mono">Input:</span> {example.input}</div>
                      <div><span className="font-mono">Output:</span> {example.output}</div>
                      {example.explanation && (
                        <div><span className="font-mono">Explanation:</span> {example.explanation}</div>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="constraints" className="mt-4">
                <ul className="list-disc list-inside space-y-2">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="font-mono text-sm">
                      {constraint}
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Code Editor */}
        <div className="space-y-4">
          <CodeEditor
            initialCode={problem.starterCode.cpp}
            onRun={handleRunCode}
          />
          <Card className="p-4">
            <div className="space-y-2">
              <div className="font-medium">Test Cases</div>
              <div className="space-y-2">
                {[1, 2, 3].map((testCase) => (
                  <div
                    key={testCase}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <span>Test Case {testCase}</span>
                    <Badge variant="outline">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Passed
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 