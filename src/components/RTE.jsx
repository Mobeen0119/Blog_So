import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';

export default function RTE({ label, name, control, defaultValue = "", error: fieldError }) {
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [apiError, setApiError] = useState(null);
    
    const apiKey = import.meta.env.VITE_TINYMCE_API_KEY || "";

    useEffect(() => {
        const checkTinyMCE = () => {
            if (window.tinymce) {
                console.log('TinyMCE global object found');
                setEditorLoaded(true);
            } else {
                console.log('TinyMCE not loaded yet');
                setTimeout(() => {
                    if (window.tinymce) {
                        console.log('TinyMCE loaded after timeout');
                        setEditorLoaded(true);
                    } else {
                        setApiError('TinyMCE failed to load. Check API key and network connection.');
                    }
                }, 3000);
            }
        };

        checkTinyMCE();
    }, []);

    const TextareaFallback = ({ value, onChange, defaultValue }) => (
        <textarea
            className="w-full h-64 p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your content here..."
            value={value || defaultValue}
            onChange={(e) => onChange(e.target.value)}
            rows={10}
        />
    );

    return (
        <div className='w-full mb-6'>
            {label && (
                <label className='block mb-2 font-semibold text-gray-700 text-lg'>
                    {label} <span className="text-red-500">*</span>
                </label>
            )}
            
            {fieldError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">⚠️ {fieldError.message || 'This field is required'}</p>
                </div>
            )}
            
            {apiError && (
                <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-700 text-sm">⚠️ {apiError}</p>
                </div>
            )}

            <Controller
                name={name || "content"}
                control={control}
                defaultValue={defaultValue}
                rules={{ 
                    required: 'Content is required',
                    validate: (value) => {
                        if (!value || value.trim() === '' || value === '<p></p>') {
                            return 'Content cannot be empty';
                        }
                        return true;
                    }
                }}
                render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                        {!editorLoaded && !apiError && (
                            <div className="h-64 bg-gray-50 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-gray-600">Loading editor...</p>
                                </div>
                            </div>
                        )}
                        
                        {apiError && (
                            <div className="p-2">
                                <p className="text-sm text-gray-600 mb-2">Using basic text editor:</p>
                                <TextareaFallback 
                                    value={value} 
                                    onChange={onChange}
                                    defaultValue={defaultValue}
                                />
                            </div>
                        )}
                        
                        {editorLoaded && !apiError && (
                            <Editor
                                apiKey={apiKey}
                                value={value || defaultValue}
                                onInit={(evt, editor) => {
                                    console.log('TinyMCE Editor initialized');
                                    setEditorLoaded(true);
                                }}
                                init={{
                                    height: 400,
                                    menubar: true,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help | link image | code',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    branding: false,
                                    promotion: false,
                                    placeholder: 'Write your content here...',
                                    setup: (editor) => {
                                        editor.on('blur', () => {
                                            onBlur();
                                        });
                                    }
                                }}
                                onEditorChange={(content) => {
                                    onChange(content);
                                }}
                                onBlur={() => {
                                    onBlur();
                                }}
                            />
                        )}
                        
                        <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                            {value && value.replace(/<[^>]*>/g, '').length} characters
                        </div>
                    </div>
                )}
            />
        </div>
    );
}