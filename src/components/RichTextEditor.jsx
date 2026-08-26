import React, { useEffect } from 'react';

import {
  EditorContent,
  useEditor,
} from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';

import Image from '@tiptap/extension-image';

function RichTextEditor({
  value,
  onChange,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],

    content: value || '<p></p>',

    editorProps: {
      attributes: {
        class:
          'rich-text-editor-content',
      },
    },

    onUpdate: ({
      editor,
    }) => {
      onChange(
        editor.getHTML()
      );
    },
  });

  /*
   * When editing an existing post,
   * update the editor when the content
   * changes from outside.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    if (
      value !== editor.getHTML()
    ) {
      editor.commands.setContent(
        value || '<p></p>',
        false
      );
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="rich-text-loading">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="rich-text-editor">

      {/* TOOLBAR */}

      <div className="rich-text-toolbar">

        <div className="toolbar-group">

          <button
            type="button"
            className={
              editor.isActive(
                'paragraph'
              )
                ? 'toolbar-button active'
                : 'toolbar-button'
            }
            onClick={() =>
              editor
                .chain()
                .focus()
                .setParagraph()
                .run()
            }
          >
            P
          </button>

          <button
            type="button"
            className={
              editor.isActive(
                'heading',
                {
                  level: 2,
                }
              )
                ? 'toolbar-button active'
                : 'toolbar-button'
            }
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: 2,
                })
                .run()
            }
          >
            H2
          </button>

          <button
            type="button"
            className={
              editor.isActive(
                'heading',
                {
                  level: 3,
                }
              )
                ? 'toolbar-button active'
                : 'toolbar-button'
            }
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: 3,
                })
                .run()
            }
          >
            H3
          </button>

        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">

          <button
            type="button"
            className={
              editor.isActive('bold')
                ? 'toolbar-button active'
                : 'toolbar-button'
            }
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
          >
            B
          </button>

          <button
            type="button"
            className={
              editor.isActive('italic')
                ? 'toolbar-button active'
                : 'toolbar-button'
            }
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
          >
            I
          </button>

          <button
            type="button"
            className={
              editor.isActive('strike')
                ? 'toolbar-button active'
                : 'toolbar-button'
            }
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
          >
            S
          </button>

        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">

          <button
            type="button"
            className={
              editor.isActive(
                'bulletList'
              )
                ? 'toolbar-button active'
                : 'toolbar-button'
            }
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run()
            }
          >
            • List
          </button>

          <button
            type="button"
            className={
              editor.isActive(
                'orderedList'
              )
                ? 'toolbar-button active'
                : 'toolbar-button'
            }
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run()
            }
          >
            1. List
          </button>

        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">

          <button
            type="button"
            className={
              editor.isActive(
                'blockquote'
              )
                ? 'toolbar-button active'
                : 'toolbar-button'
            }
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBlockquote()
                .run()
            }
          >
            Quote
          </button>

          <button
            type="button"
            className={
              editor.isActive(
                'codeBlock'
              )
                ? 'toolbar-button active'
                : 'toolbar-button'
            }
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleCodeBlock()
                .run()
            }
          >
            Code
          </button>

          <button
            type="button"
            className="toolbar-button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setHorizontalRule()
                .run()
            }
          >
            Line
          </button>

        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">

          <button
            type="button"
            className="toolbar-button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .undo()
                .run()
            }
            disabled={
              !editor.can()
                .chain()
                .focus()
                .undo()
                .run()
            }
          >
            Undo
          </button>

          <button
            type="button"
            className="toolbar-button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .redo()
                .run()
            }
            disabled={
              !editor.can()
                .chain()
                .focus()
                .redo()
                .run()
            }
          >
            Redo
          </button>

        </div>
      </div>

      {/* EDITOR */}

      <EditorContent
        editor={editor}
      />
    </div>
  );
}

export default RichTextEditor;