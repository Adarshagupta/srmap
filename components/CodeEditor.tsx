import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: string;
  options?: any;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  theme = 'vs-dark',
  options = {}
}: CodeEditorProps) {
  return (
    <Editor
      height="500px"
      defaultLanguage={language}
      defaultValue={value}
      theme={theme}
      onChange={(value) => onChange(value || '')}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        ...options
      }}
    />
  );
} 