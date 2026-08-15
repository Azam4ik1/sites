'use client';

import React, { useState } from 'react';
import {
  Bold,
  Italic,
  List,
  Quote,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { ImagePickerModal } from './ImagePickerModal';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function RichTextEditor({ value, onChange, label }: RichTextEditorProps) {
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const insertTag = (startTag: string, endTag: string = '') => {
    const textarea = document.getElementById('rich-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    const replacement = `${startTag}${selectedText}${endTag}`;
    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, end + startTag.length);
    }, 0);
  };

  const handleInsertImage = (url: string) => {
    insertTag(`<img src="${url}" alt="Тасвир" class="my-4 rounded-xl max-w-full shadow-md" />\n`);
  };

  const handleInsertLink = () => {
    const url = prompt('URL-ро ворид кунед:');
    if (url) {
      insertTag(`<a href="${url}" class="text-navy-700 underline font-medium hover:text-gold-600" target="_blank">`, '</a>');
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-navy-900">{label}</label>}

      <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-navy-600 focus-within:border-transparent">
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
          <button
            type="button"
            onClick={() => insertTag('<h2>', '</h2>')}
            title="Заголовок H2"
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>')}
            title="Заголовок H3"
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>')}
            title="Жирный"
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<em>', '</em>')}
            title="Курсив"
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
            title="Маркированный список"
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<blockquote class="border-l-4 border-gold-500 pl-4 my-4 italic text-gray-700">\n  ', '\n</blockquote>')}
            title="Цитата"
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={handleInsertLink}
            title="Ссылка"
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsImagePickerOpen(true)}
            title="Вставить картинку"
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition flex items-center gap-1 font-medium text-xs text-navy-800"
          >
            <ImageIcon className="w-4 h-4 text-gold-600" />
            <span>Вставить тасвир</span>
          </button>
        </div>

        <textarea
          id="rich-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          placeholder="Матни мақоларо дар ин ҷо ворид кунед (HTML/Маркдаун дастгирӣ карда мешавад)..."
          className="w-full p-4 text-sm text-gray-800 font-sans focus:outline-none resize-y min-h-[250px]"
        />
      </div>

      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelect={handleInsertImage}
      />
    </div>
  );
}
