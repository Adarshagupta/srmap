import { NextResponse } from 'next/server';
import Docker from 'dockerode';

const docker = new Docker();

interface CodeRunRequest {
  code: string;
  language: string;
  testCases: {
    input: string[];
    output: any[];
  }[];
}

interface LanguageConfig {
  image: string;
  extension: string;
  compileCmd?: string[];
  runCmd: string[];
  timeout: number;
}

const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  python: {
    image: 'code-runner-python',
    extension: '.py',
    runCmd: ['python', '-c'],
    timeout: 5000,
  },
  cpp: {
    image: 'code-runner-cpp',
    extension: '.cpp',
    compileCmd: ['g++', '-o', 'program'],
    runCmd: ['./program'],
    timeout: 5000,
  },
  java: {
    image: 'code-runner-java',
    extension: '.java',
    compileCmd: ['javac', 'Main.java'],
    runCmd: ['java', 'Main'],
    timeout: 5000,
  },
};

export async function POST(request: Request) {
  try {
    const body: CodeRunRequest = await request.json();
    const { code, language, testCases } = body;

    const config = LANGUAGE_CONFIGS[language];
    if (!config) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      testCases.map(async (testCase) => {
        try {
          const startTime = Date.now();

          // Create container with appropriate configuration
          const container = await docker.createContainer({
            Image: config.image,
            Cmd: config.runCmd.concat([code]),
            Tty: true,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            StopTimeout: config.timeout,
            HostConfig: {
              Memory: 512 * 1024 * 1024, // 512MB memory limit
              MemorySwap: 512 * 1024 * 1024, // Disable swap
              CpuPeriod: 100000,
              CpuQuota: 50000, // Limit to 50% CPU
            },
          });

          // Start container and get output
          await container.start();
          const output = await container.logs({
            stdout: true,
            stderr: true,
            follow: true,
            since: (Date.now() / 1000) - 1,
          });

          // Clean up container
          await container.stop();
          await container.remove();

          const executionTime = Date.now() - startTime;
          const outputStr = output.toString().trim();

          // Compare output with expected output
          const passed = outputStr === testCase.output.toString().trim();

          return {
            passed,
            message: passed ? 'Test case passed!' : 'Test case failed.',
            output: outputStr,
            executionTime,
          };
        } catch (error) {
          console.error('Error running test case:', error);
          return {
            passed: false,
            message: 'Error running test case',
            error: error instanceof Error ? error.message : 'Unknown error',
            executionTime: 0,
          };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 