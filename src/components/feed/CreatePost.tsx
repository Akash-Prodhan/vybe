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
        <div className="card p-0 mb-4 overflow-hidden fade-in">
            <div className="p-4">
                <div className="flex gap-3">
                    <div className="w-10 h-10 avatar text-xs flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={2}
                        className="flex-1 bg-surface-hover rounded-2xl px-4 py-2.5 text-[15px] text-primary placeholder:text-muted outline-none resize-none focus:ring-2 focus:ring-accent/20 transition-all"
                        maxLength={500}
                    />
                </div>
            </div>

            {preview && (
                <div className="relative mx-4 mb-3 rounded-xl overflow-hidden bg-bg-tertiary">
                    {isVideo ? (
                        <video src={preview} className="w-full max-h-64 object-contain rounded-xl" controls />
                    ) : (
                        <img src={preview} alt="" className="w-full max-h-64 object-cover rounded-xl" />
                    )}
                    <button
                        onClick={removeFile}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
            )}

            <div className="flex items-center justify-between px-4 py-3 border-t border-border-light">
                <div className="flex gap-1">
                    <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover text-sm font-medium text-success transition-colors" title="Photo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-success"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        Photo
                    </button>
                    <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover text-sm font-medium text-rose transition-colors" title="Video">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-rose"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                        Video
                    </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={handleFileChange} />
                <button
                    onClick={handleSubmit}
                    disabled={loading || (!content.trim() && !file)}
                    className="btn btn-primary text-sm px-6 py-2"
                >
                    {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : 'Post'}
                </button>
            </div>
        </div>
    );
}
