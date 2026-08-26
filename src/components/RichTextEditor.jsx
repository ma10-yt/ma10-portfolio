import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  EditorContent,
  useEditor,
} from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

import { NodeSelection } from '@tiptap/pm/state';

import { supabase } from '../supabase';

function RichTextEditor({
  value,
  onChange,
}) {
  const fileInputRef =
    useRef(null);

  const lastValueRef =
    useRef(value || '<p></p>');

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [uploadMessage, setUploadMessage] =
    useState('');

  const [selectedImage, setSelectedImage] =
  useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,

      Image.configure({
        inline: false,
        allowBase64: false,
        selectable: true,
        draggable: true,
      }),
    ],

    content:
      value || '<p></p>',

    editorProps: {
      attributes: {
        class:
          'rich-text-editor-content',
      },

      /*
       * Tiptap gives us the exact position of
       * the clicked node through handleClickOn.
       */
      handleClickOn(
        view,
        pos,
        node,
        nodePos,
        event
      ) {
        if (
          node.type.name !== 'image'
        ) {
          return false;
        }

        const selection =
          NodeSelection.create(
            view.state.doc,
            nodePos
          );

        view.dispatch(
          view.state.tr.setSelection(
            selection
          )
        );

        return true;
      },
    },

    onUpdate: ({
      editor,
    }) => {
      const html =
        editor.getHTML();

      lastValueRef.current =
        html;

      onChange(html);
    },
  });

  useEffect(() => {
  if (!editor) {
    return;
  }

  const updateImageSelection = () => {
    const selection =
      editor.state.selection;

    setSelectedImage(
      selection instanceof NodeSelection &&
      selection.node?.type?.name === 'image'
    );
  };

  updateImageSelection();

  editor.on(
    'selectionUpdate',
    updateImageSelection
  );

  return () => {
    editor.off(
      'selectionUpdate',
      updateImageSelection
    );
  };
}, [editor]);

  /*
   * Load external content only when the actual
   * post content changes.
   *
   * This is important because we don't want
   * every React render to reset the editor and
   * destroy the current image selection.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextValue =
      value || '<p></p>';

    if (
      nextValue ===
      lastValueRef.current
    ) {
      return;
    }

    if (
      nextValue ===
      editor.getHTML()
    ) {
      lastValueRef.current =
        nextValue;

      return;
    }

    lastValueRef.current =
      nextValue;

    editor.commands.setContent(
      nextValue,
      false
    );
  }, [
    value,
    editor,
  ]);

  /*
   * Open image picker.
   */
  const openImagePicker =
    () => {
      fileInputRef.current?.click();
    };

  /*
   * Upload image.
   */
  const handleImageUpload =
    async (event) => {
      const file =
        event.target.files?.[0];

      event.target.value =
        '';

      if (!file) {
        return;
      }

      setUploadMessage('');

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
      ];

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        setUploadMessage(
          'Please choose a JPG, PNG, WebP, or GIF image.'
        );

        return;
      }

      const maxSize =
        5 * 1024 * 1024;

      if (
        file.size >
        maxSize
      ) {
        setUploadMessage(
          'Image must be smaller than 5 MB.'
        );

        return;
      }

      setUploadingImage(
        true
      );

      setUploadMessage(
        'Uploading image...'
      );

      try {
        const {
          data: {
            session,
          },
        } =
          await supabase.auth.getSession();

        if (!session) {
          throw new Error(
            'You must be logged in as admin to upload images.'
          );
        }

        const cleanName =
          file.name
            .toLowerCase()
            .replace(
              /[^a-z0-9.-]/g,
              '-'
            );

        const filePath =
          `${Date.now()}-${crypto.randomUUID()}-${cleanName}`;

        const {
          error: uploadError,
        } =
          await supabase.storage
            .from('blog-images')
            .upload(
              filePath,
              file,
              {
                cacheControl:
                  '3600',
                upsert:
                  false,
                contentType:
                  file.type,
              }
            );

        if (
          uploadError
        ) {
          throw uploadError;
        }

        const {
          data:
            publicUrlData,
        } =
          supabase.storage
            .from('blog-images')
            .getPublicUrl(
              filePath
            );

        const imageUrl =
          publicUrlData?.publicUrl;

        if (!imageUrl) {
          throw new Error(
            'Could not generate the image URL.'
          );
        }

        editor
          .chain()
          .focus()
          .setImage({
            src: imageUrl,
            alt: file.name,
            title: file.name,
          })
          .run();

        setUploadMessage(
          'Image uploaded successfully.'
        );
      } catch (error) {
        console.error(
          'Image upload failed:',
          error
        );

        setUploadMessage(
          error.message ||
            'Image upload failed.'
        );
      } finally {
        setUploadingImage(
          false
        );
      }
    };

  /*
   * Remove selected image.
   */
  const removeSelectedImage =
  () => {
    if (!editor) {
      return;
    }

    const selection =
      editor.state.selection;

    if (
      !(
        selection instanceof NodeSelection
      ) ||
      selection.node?.type?.name !==
        'image'
    ) {
      setUploadMessage(
        'Click an image first.'
      );

      return;
    }

    editor
      .chain()
      .focus()
      .deleteSelection()
      .run();

    setSelectedImage(
      false
    );

    setUploadMessage(
      'Image removed from the article.'
    );
  };

  /*
   * Delete selected image with keyboard.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleKeyDown =
      (event) => {
        if (
          !editor.isActive('image')
        ) {
          return;
        }

        if (
          event.key === 'Delete' ||
          event.key === 'Backspace'
        ) {
          event.preventDefault();

          editor
            .chain()
            .focus()
            .deleteSelection()
            .run();

          setUploadMessage(
            'Image removed from the article.'
          );
        }
      };

    editor.view.dom.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      editor.view.dom.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    editor,
  ]);

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
                { level: 2 }
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
                { level: 3 }
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
            className="toolbar-button image-toolbar-button"
            onClick={
              openImagePicker
            }
            disabled={
              uploadingImage
            }
          >
            {uploadingImage
              ? 'Uploading...'
              : 'Image'}
          </button>

          <input
            ref={
              fileInputRef
            }
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={
              handleImageUpload
            }
            hidden
          />

          <button
  type="button"
  className={
    selectedImage
      ? 'toolbar-button image-remove-button active'
      : 'toolbar-button image-remove-button'
  }
  onClick={
    removeSelectedImage
  }
  disabled={
    !selectedImage
  }
>
  Remove image
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
              !editor
                .can()
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
              !editor
                .can()
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

      {uploadMessage && (
        <div className="rich-text-upload-message">
          {uploadMessage}
        </div>
      )}

      <EditorContent
        editor={editor}
      />

    </div>
  );
}

export default RichTextEditor;