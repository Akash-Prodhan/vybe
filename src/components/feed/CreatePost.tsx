'use client';

import { useState, useRef } from 'react';
import { createPost } from '@/app/(main)/actions';
import { useRouter } from 'next/navigation';

export default function CreatePost({ onCreated }: { onCreated?: () => void }) {
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isVideo, setIsVideo] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setIsVideo(f.type.startsWith('video/'));
        setPreview(URL.createObjectURL(f));
    }

    function removeFile() {
        setFile(null);
        setPreview(null);
        setIsVideo(false);
        if (fileRef.current) fileRef.current.value = '';
    }

    async function handleSubmit() {
        if (!content.trim() && !file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('content', content);
        if (file) formData.append('image', file);
        const result = await createPost(formData);
        setLoading(false);
        if (!result.error) {
            setContent('');
            removeFile();
            router.refresh();
            onCreated?.();
        }
    }

    return (
        <div className="card p-4 mb-5">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                className="input resize-none border-0 bg-transparent px-0 focus:shadow-none focus:ring-0"
                maxLength={500}
            />

            {preview && (
                <div className="relative mt-2 rounded-xl overflow-hidden bg-bg-tertiary">
                    {isVideo ? (
                        <video src={preview} className="w-full max-h-64 object-contain rounded-xl" controls />
                    ) : (
                        <img src={preview} alt="" className="w-full max-h-64 object-cover rounded-xl" />
                    )}
                    <button
                        onClick={removeFile}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light">
                <div className="flex gap-1">
                    <button onClick={() => fileRef.current?.click()} className="btn btn-ghost p-2 rounded-lg" title="Photo/Video">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </button>
                    <button onClick={() => fileRef.current?.click()} className="btn btn-ghost p-2 rounded-lg" title="Video">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-rose"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                    </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={handleFileChange} />
                <button
                    onClick={handleSubmit}
                    disabled={loading || (!content.trim() && !file)}
                    className="btn btn-primary text-xs px-5 py-2 font-semibold"
                >
                    {loading ? (
                        <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Post'
                    )}
                </button>
            </div>
        </div>
    );
}
