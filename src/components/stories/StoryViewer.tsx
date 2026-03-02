'use client';

import { useState, useEffect, useCallback } from 'react';
import { getInitials, formatRelativeTime } from '@/lib/utils';
import { deleteStory } from '@/app/(main)/stories/actions';

interface StoryViewerProps {
    group: {
        userId: string;
        profile: { username: string; full_name: string | null; avatar_url: string | null };
        stories: {
            id: string;
            media_url: string;
            media_type: string;
            caption: string | null;
            created_at: string;
        }[];
    };
    onClose: () => void;
    currentUserId: string;
}

export default function StoryViewer({ group, onClose, currentUserId }: StoryViewerProps) {
    const [index, setIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const story = group.stories[index];
    const isOwn = group.userId === currentUserId;

    const goNext = useCallback(() => {
        if (index < group.stories.length - 1) {
            setIndex((i) => i + 1);
            setProgress(0);
        } else {
            onClose();
        }
    }, [index, group.stories.length, onClose]);

    const goPrev = useCallback(() => {
        if (index > 0) {
            setIndex((i) => i - 1);
            setProgress(0);
        }
    }, [index]);

    // Auto-advance timer
    useEffect(() => {
        if (story.media_type === 'video') return; // Video handles own timing

        const duration = 5000; // 5 seconds per story
        const interval = 50;
        const step = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    goNext();
                    return 0;
                }
                return p + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [index, story.media_type, goNext]);

    // Keyboard navigation
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, goNext, goPrev]);

    async function handleDelete() {
        await deleteStory(story.id);
        goNext();
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={onClose}>
            <div className="relative w-full max-w-md h-[85vh] max-h-[700px] mx-4" onClick={(e) => e.stopPropagation()}>
                {/* Progress bars */}
                <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
                    {group.stories.map((_, i) => (
                        <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-100"
                                style={{
                                    width: i < index ? '100%' : i === index ? `${progress}%` : '0%',
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-6 left-3 right-3 flex items-center justify-between z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 avatar text-xs bg-white/20">
                            {group.profile.avatar_url ? (
                                <img src={group.profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <span className="text-white">{getInitials(group.profile.full_name || group.profile.username)}</span>
                            )}
                        </div>
                        <div>
                            <p className="text-white text-xs font-semibold">{group.profile.username}</p>
                            <p className="text-white/50 text-[10px]">{formatRelativeTime(story.created_at)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isOwn && (
                            <button onClick={handleDelete} className="text-white/60 hover:text-red-400 transition-colors p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                            </button>
                        )}
                        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>
                </div>

                {/* Media */}
                <div className="w-full h-full rounded-2xl overflow-hidden bg-black">
                    {story.media_type === 'video' ? (
                        <video
                            src={story.media_url}
                            className="w-full h-full object-contain"
                            autoPlay
                            playsInline
                            onEnded={goNext}
                        />
                    ) : (
                        <img
                            src={story.media_url}
                            alt=""
                            className="w-full h-full object-contain"
                        />
                    )}
                </div>

                {/* Caption */}
                {story.caption && (
                    <div className="absolute bottom-6 left-4 right-4 z-20">
                        <p className="text-white text-sm bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                            {story.caption}
                        </p>
                    </div>
                )}

                {/* Touch areas for prev/next */}
                <div className="absolute inset-0 flex z-10">
                    <button className="w-1/3 h-full" onClick={goPrev} />
                    <div className="w-1/3" />
                    <button className="w-1/3 h-full" onClick={goNext} />
                </div>
            </div>
        </div>
    );
}
