import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface RichTextEditorProps {
    value: string;
    onChange: (value: string, delta: any, source: any, editor: any) => void;
}

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
    ],
};

const formats = [
    'header', 'font', 'color', 'background', 'align',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => (
    <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
    />
);

export default RichTextEditor;
