'use client';

import { useRef, useEffect } from 'react';

export default function RichTextEditor({ content, onChange, placeholder }) {
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content || '';
    }
  }, []);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange();
  };

  const handleContentChange = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const formatBlock = (tag) => {
    execCommand('formatBlock', tag);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        execCommand('insertImage', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-base-300 rounded-box overflow-hidden bg-base-100">
      {/* Toolbar */}
      <div ref={toolbarRef} className="bg-base-200 border-b border-base-300 p-3">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 mr-2">
            <button
              type="button"
              onClick={() => execCommand('bold')}
              className="btn btn-ghost btn-sm"
              title="Bold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 12h8m0 0a4 4 0 100-8H6v8zm8 0a4 4 0 110 8H6v-8z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => execCommand('italic')}
              className="btn btn-ghost btn-sm"
              title="Italic"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 4l4 16M6 8h12M4 16h12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => execCommand('underline')}
              className="btn btn-ghost btn-sm"
              title="Underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 20h14m-7-18v10a3 3 0 006 0V2" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => execCommand('strikeThrough')}
              className="btn btn-ghost btn-sm"
              title="Strikethrough"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7v14" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="divider divider-horizontal mx-0"></div>

          {/* Block Formatting */}
          <div className="flex gap-1 mr-2">
            <select
              onChange={(e) => formatBlock(e.target.value)}
              className="select select-ghost select-sm"
              defaultValue=""
            >
              <option value="" disabled>Format</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="p">Paragraph</option>
              <option value="blockquote">Quote</option>
            </select>
          </div>

          {/* Divider */}
          <div className="divider divider-horizontal mx-0"></div>

          {/* Lists */}
          <div className="flex gap-1 mr-2">
            <button
              type="button"
              onClick={() => execCommand('insertUnorderedList')}
              className="btn btn-ghost btn-sm"
              title="Bullet List"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => execCommand('insertOrderedList')}
              className="btn btn-ghost btn-sm"
              title="Numbered List"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6V4a2 2 0 012-2h12a2 2 0 012 2v2M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M4 6h16M8 10h8m-8 4h8" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="divider divider-horizontal mx-0"></div>

          {/* Alignment */}
          <div className="flex gap-1 mr-2">
            <button
              type="button"
              onClick={() => execCommand('justifyLeft')}
              className="btn btn-ghost btn-sm"
              title="Align Left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h8M4 10h16M4 14h8M4 18h16" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyCenter')}
              className="btn btn-ghost btn-sm"
              title="Center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6h8M6 10h12M8 14h8M6 18h12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyRight')}
              className="btn btn-ghost btn-sm"
              title="Align Right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6h8M8 10h12M12 14h8M8 18h12" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="divider divider-horizontal mx-0"></div>

          {/* Links and Media */}
          <div className="flex gap-1 mr-2">
            <button
              type="button"
              onClick={insertLink}
              className="btn btn-ghost btn-sm"
              title="Insert Link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            <label className="btn btn-ghost btn-sm cursor-pointer" title="Upload Image">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </label>
            <button
              type="button"
              onClick={insertImage}
              className="btn btn-ghost btn-sm"
              title="Insert Image URL"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="divider divider-horizontal mx-0"></div>

          {/* Utilities */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => execCommand('removeFormat')}
              className="btn btn-ghost btn-sm"
              title="Clear Formatting"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => execCommand('undo')}
              className="btn btn-ghost btn-sm"
              title="Undo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => execCommand('redo')}
              className="btn btn-ghost btn-sm"
              title="Redo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        className="min-h-[300px] max-h-[500px] overflow-y-auto p-4 focus:outline-none"
        style={{
          lineHeight: '1.6',
          fontSize: '16px'
        }}
        dangerouslySetInnerHTML={{ __html: placeholder && !content ? `<p class="text-base-content/50">${placeholder}</p>` : content || '' }}
      />

      {/* Footer with shortcuts */}
      <div className="bg-base-200 border-t border-base-300 px-4 py-2 text-xs text-base-content/60">
        <div className="flex gap-4">
          <span>Ctrl+B: Bold</span>
          <span>Ctrl+I: Italic</span>
          <span>Ctrl+U: Underline</span>
          <span>Ctrl+Z: Undo</span>
          <span>Tab: Indent</span>
        </div>
      </div>

      <style jsx>{`
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        [contenteditable] h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        [contenteditable] h4 {
          font-size: 1.125em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        [contenteditable] p {
          margin: 0.5em 0;
        }
        [contenteditable] blockquote {
          border-left: 4px solid #ccc;
          margin: 1em 0;
          padding-left: 1em;
          color: #666;
          font-style: italic;
        }
        [contenteditable] ul, [contenteditable] ol {
          margin: 0.5em 0;
          padding-left: 2em;
        }
        [contenteditable] li {
          margin: 0.25em 0;
        }
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          margin: 0.5em 0;
        }
        [contenteditable]:focus {
          outline: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
