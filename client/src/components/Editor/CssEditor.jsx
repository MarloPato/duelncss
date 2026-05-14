import Editor from '@monaco-editor/react';
import './CssEditor.css';

export default function CssEditor({ value, onChange, language = 'css' }) {
  return (
    <div className="css-editor">
      {value === '' && (
        <div className="editor-placeholder">
          {language === 'css'
            ? 'Start typing CSS to match the target…'
            : 'Edit HTML structure…'}
        </div>
      )}
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          automaticLayout: true,
          padding: { top: 8 },
        }}
      />
    </div>
  );
}
