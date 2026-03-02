'use client';

import CreatePost from '@/components/feed/CreatePost';
import PostCard from '@/components/feed/PostCard';
import { useRouter } from 'next/navigation';

interface FeedClientProps {
    posts: any[];
    currentUserId: string;
}

export default function FeedClient({ posts, currentUserId }: FeedClientProps) {
    const router = useRouter();

    return (
        <>
            <CreatePost onCreated={() => router.refresh()} />

            {posts.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </div>
                    <p className="text-secondary text-sm font-medium">No posts yet</p>
                    <p className="text-secondary/50 text-xs mt-1">Be the first to share something!</p>
                </div>
            ) : (
                <div>
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
                    ))}
                </div>
            )}
        </>
    );
}
