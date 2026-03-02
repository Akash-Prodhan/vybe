'use client';

import CreatePost from '@/components/feed/CreatePost';
import PostCard from '@/components/feed/PostCard';
import { useRouter } from 'next/navigation';

interface FeedClientProps {
    initialPosts: any[];
    currentUserId: string;
}

export default function FeedClient({ initialPosts, currentUserId }: FeedClientProps) {
    const router = useRouter();

    function handlePostCreated() {
        router.refresh();
    }

    return (
        <>
            <CreatePost onPostCreated={handlePostCreated} />

            {initialPosts.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-secondary text-sm">No posts yet. Be the first to share something!</p>
                </div>
            ) : (
                <div>
                    {initialPosts.map((post) => (
                        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
                    ))}
                </div>
            )}
        </>
    );
}
