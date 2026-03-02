'use client';

import { useState, useRef } from 'react';
import { createPost } from '@/app/(main)/actions';

export default function CreatePost({ onPostCreated }: { onPostCreated?: () => void }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        if (!content.trim() && !fileRef.current?.files?.length) return;
        setLoading(true);

        const result = await createPost(formData);
        if (!result.error) {
            setContent('');
            setPreview(null);
            if (fileRef.current) fileRef.current.value = '';
            onPostCreated?.();
        }
        setLoading(false);
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    }

    function removeImage() {
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
    }

    return (
        <div className="card p-4 mb-4">
            <form ref={formRef} action={handleSubmit}>
                <textarea
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full resize-none border-none outline-none text-sm leading-relaxed bg-transparent placeholder:text-secondary/50"
                    rows={3}
                    maxLength={1000}
                />

                {preview && (
                    <div className="relative mt-3 rounded-xl overflow-hidden">
                        <img src={preview} alt="Preview" className="w-full max-h-72 object-cover rounded-xl" />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light">
                    <div className="flex items-center gap-2">
                        <input
                            ref={fileRef}
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="post-image"
                        />
                        <label
                            htmlFor="post-image"
                            className="btn btn-ghost p-2 cursor-pointer"
                            title="Add image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (!content.trim() && !preview)}
                        className="btn btn-primary px-5 py-2 text-sm"
                    >
                        {loading ? (
                            <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Post'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
