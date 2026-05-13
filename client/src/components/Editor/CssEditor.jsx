import Editor from '@monaco-editor/react';
import './CssEditor.css';

export default function CssEditor({ value, onChange }) {
  return (
    <div className="css-editor">
      <div className="editor-header">CSS</div>
      <Editor
        height="100%"
        defaultLanguage="css"
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
