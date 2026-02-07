import  { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import conf from '../conf/conf.js';

export default function RTE({ label, name, control, defaultValue = "", error: fieldError }) {
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [apiError, setApiError] = useState(null);
   
const  apiKey=conf.tinymceApiKey;
    useEffect(() => {
        const checkTinyMCE = () => {
            if (window.tinymce) {
                setEditorLoaded(true);
            } else {
                setTimeout(() => {
                    if (window.tinymce) setEditorLoaded(true);
                    else setApiError('CONNECTION ERROR: EDITOR FAILED TO INITIALIZE');
                }, 3000);
            }
        };
        checkTinyMCE();
    }, []);

    const TextareaFallback = ({ value, onChange }) => (
        <textarea
            className="w-full h-80 p-6 bg-white text-black font-mono text-sm focus:outline-none border-t-4 border-black"
            placeholder="Type your story here..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );

    return (
        <div className='w-full mb-10'>
            {label && (
                <div className="flex items-baseline gap-4 mb-4">
                    <label className='text-xs font-black uppercase tracking-[0.3em] text-black'>
                        {label}
                    </label>
                    <span className="h-px grow bg-zinc-200"></span>
                </div>
            )}
            
            <Controller
                name={name || "content"}
                control={control}
                defaultValue={defaultValue}
                rules={{ 
                    required: 'FIELD_REQUIRED',
                    validate: (value) => (value?.trim() && value !== '<p></p>') || 'CONTENT_EMPTY'
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                    <div className={`border-4 transition-all duration-300 ${fieldError ? 'border-red-500 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]' : 'border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}`}>
                        
                        {!editorLoaded && !apiError && (
                            <div className="h-80 bg-zinc-50 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-10 h-10 border-4 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
                                    <p className="text-[10px] font-black tracking-widest uppercase">Show some Patience</p>
                                </div>
                            </div>
                        )}
                        
                        {apiError && (
                            <div className="p-4 bg-zinc-100">
                                <p className="text-[10px] font-black text-red-600 mb-4 uppercase tracking-tighter">⚠️ {apiError}</p>
                                <TextareaFallback value={value} onChange={onChange} />
                            </div>
                        )}
                        
                        {editorLoaded && !apiError && (
                            <Editor
                                apiKey={apiKey}
                                value={value || defaultValue}
                                init={{
                                    height: 450,
                                    menubar: false,
                                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'preview', 'code', 'wordcount'],
                                    toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | code',
                                    content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px; line-height:1.6; color:#18181b }',
                                    branding: false,
                                    promotion: false,
                                    skin: "oxide",
                                    setup: (editor) => {
                                        editor.on('blur', () => onBlur());
                                    }
                                }}
                                onEditorChange={(content) => onChange(content)}
                            />
                        )}
                        
                        <div className="flex justify-between items-center px-4 py-2 bg-black text-white text-[10px] font-mono uppercase tracking-widest">
                            <span>{fieldError ? fieldError.message : 'System Ready'}</span>
                            <span>{value?.replace(/<[^>]*>/g, '').length || 0} CHR</span>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}