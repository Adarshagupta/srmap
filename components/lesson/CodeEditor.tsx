'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  language: 'python' | 'cpp' | 'java';
  onChange: (value: string) => void;
}

export function CodeEditor({ code, language, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      onChange={(value) => onChange(value || '')}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: 'on',
        wrappingIndent: 'indent',
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true,
        },
        parameterHints: {
          enabled: true,
        },
        folding: true,
        foldingStrategy: 'indentation',
        matchBrackets: 'always',
        renderWhitespace: 'selection',
        rulers: [80, 120],
        colorDecorators: true,
        contextmenu: true,
        mouseWheelZoom: true,
        suggest: {
          showKeywords: true,
          showSnippets: true,
          showClasses: true,
          showFunctions: true,
          showConstants: true,
          showConstructors: true,
        },
      }}
    />
  );
} 