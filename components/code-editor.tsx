"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Play, RotateCcw } from 'lucide-react';

const LANGUAGES = [
  { id: 'cpp', name: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}' },
  { id: 'java', name: 'Java', template: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}' },
  { id: 'python', name: 'Python', template: '# Your code here' },
];

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onRun?: (code: string) => void;
}

export function CodeEditor({ initialCode, language = 'cpp', onRun }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || LANGUAGES.find(l => l.id === language)?.template || '');
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      onRun?.(code);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    const template = LANGUAGES.find(l => l.id === selectedLanguage)?.template || '';
    setCode(template);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.id} value={lang.id}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
          >
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
        </div>
      </div>

      <div className="relative min-h-[300px] border rounded-lg">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full min-h-[300px] p-4 font-mono text-sm bg-muted/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          spellCheck={false}
        />
      </div>
    </Card>
  );
} 