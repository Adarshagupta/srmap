export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: any[];
  output: any;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptance: string;
  description: string;
  examples: Example[];
  constraints: string[];
  starterCode: string;
  testCases: TestCase[];
} 