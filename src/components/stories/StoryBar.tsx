'use client';

import { useState, useRef } from 'react';
import { getInitials } from '@/lib/utils';
import StoryViewer from './StoryViewer';
import CreateStory from './CreateStory';

interface StoryGroup {
    userId: string;
    profile: { username: string; full_name: string | null; avatar_url: string | null };
    stories: {
        id: string;
        media_url: string;
        media_type: string;
        caption: string | null;
        created_at: string;
    }[];
}

interface StoryBarProps {
    storyGroups: StoryGroup[];
    currentUserId: string;
}

export default function StoryBar({ storyGroups, currentUserId }: StoryBarProps) {
    const [viewingGroup, setViewingGroup] = useState<StoryGroup | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const hasOwnStory = storyGroups.some((g) => g.userId === currentUserId);

    return (
        <>
            <div className="mb-4">
                <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                    {/* Add Story Button */}
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
                    >
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-accent/40 flex items-center justify-center bg-accent/5 group-hover:bg-accent/10 group-hover:border-accent transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </div>
                        <span className="text-[10px] font-medium text-secondary">Your story</span>
                    </button>

                    {/* Story circles */}
                    {storyGroups.map((group) => (
                        <button
                            key={group.userId}
                            onClick={() => setViewingGroup(group)}
                            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
                        >
                            <div className="story-ring">
                                <div className="w-16 h-16 avatar text-sm bg-bg-tertiary">
                                    {group.profile.avatar_url ? (
                                        <img src={group.profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
                                    ) : (
                                        getInitials(group.profile.full_name || group.profile.username)
                                    )}
                                </div>
                            </div>
                            <span className="text-[10px] font-medium text-secondary truncate max-w-[64px]">
                                {group.userId === currentUserId ? 'You' : group.profile.username}
                            </span>
                        </button>
                    ))}

                    {storyGroups.length === 0 && !hasOwnStory && (
                        <div className="flex items-center text-xs text-secondary/50 pl-3">
                            No stories yet — be the first!
                        </div>
                    )}
                </div>
            </div>

            {/* Story Viewer Modal */}
            {viewingGroup && (
                <StoryViewer
                    group={viewingGroup}
                    onClose={() => setViewingGroup(null)}
                    currentUserId={currentUserId}
                />
            )}

            {/* Create Story Modal */}
            {showCreate && (
                <CreateStory onClose={() => setShowCreate(false)} />
            )}
        </>
    );
}
