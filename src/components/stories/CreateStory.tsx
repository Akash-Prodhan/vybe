'use client';

import { useState, useRef } from 'react';
import { createStory } from '@/app/(main)/stories/actions';
import { useRouter } from 'next/navigation';

interface CreateStoryProps {
    onClose: () => void;
}

export default function CreateStory({ onClose }: CreateStoryProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isVideo, setIsVideo] = useState(false);
    const [caption, setCaption] = useState('');
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

    async function handleSubmit() {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('media', file);
        formData.append('caption', caption);
        const result = await createStory(formData);
        setLoading(false);
        if (!result.error) {
            router.refresh();
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="card-glass w-full max-w-md p-6 scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold font-display">Create Story</h2>
                    <button onClick={onClose} className="btn btn-ghost p-1.5 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {!preview ? (
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-accent/50 hover:bg-accent/5 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium">Upload photo or video</p>
                            <p className="text-xs text-secondary mt-1">JPG, PNG, MP4, WebM</p>
                        </div>
                    </button>
                ) : (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-black mb-3">
                        {isVideo ? (
                            <video src={preview} className="w-full h-full object-contain" controls />
                        ) : (
                            <img src={preview} alt="" className="w-full h-full object-contain" />
                        )}
                        <button
                            onClick={() => { setFile(null); setPreview(null); }}
                            className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>
                )}

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,video/mp4,video/webm"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <input
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption..."
                    className="input mt-3"
                    maxLength={200}
                />

                <button
                    onClick={handleSubmit}
                    disabled={!file || loading}
                    className="btn btn-primary w-full mt-4 py-3 font-semibold"
                >
                    {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Share Story'
                    )}
                </button>
            </div>
        </div>
    );
}
