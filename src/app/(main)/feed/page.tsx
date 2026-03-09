import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import FeedClient from '@/components/feed/FeedClient';
import StoryBar from '@/components/stories/StoryBar';
import { getActiveStories } from '@/app/(main)/stories/actions';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';

export default async function FeedPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: posts } = await supabase
        .from('posts')
        .select(`
            id, content, image_url, created_at, user_id, updated_at,
            profiles!posts_user_id_fkey (username, full_name, avatar_url),
            likes (id, user_id),
            comments (id, content, user_id, created_at, profiles!comments_user_id_fkey (username, avatar_url))
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(30);

    const storyGroups = await getActiveStories();

    // Suggested users (people the user doesn't follow yet)
    const { data: following } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', user.id);

    const followingIds = following?.map(f => f.following_id) || [];

    const { data: suggestedUsers } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, bio, follower_count')
        .neq('id', user.id)
        .not('id', 'in', `(${[...followingIds, user.id].join(',')})`)
        .order('follower_count', { ascending: false })
        .limit(5);

    // Trending: top hashtags from recent posts (simplified: top active users)
    const { data: trendingPosts } = await supabase
        .from('posts')
        .select('content')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(50);

    // Extract hashtags from posts
    const hashtagCounts: Record<string, number> = {};
    trendingPosts?.forEach(p => {
        const matches = p.content?.match(/#\w+/g);
        matches?.forEach((tag: string) => {
            const t = tag.toLowerCase();
            hashtagCounts[t] = (hashtagCounts[t] || 0) + 1;
        });
    });
    const trendingTopics = Object.entries(hashtagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

    return (
        <div className="feed-layout">
            {/* Center Feed */}
            <div className="feed-center">
                <StoryBar storyGroups={storyGroups as any} currentUserId={user.id} />
                <FeedClient posts={(posts || []) as any} currentUserId={user.id} />
            </div>

            {/* Right Sidebar */}
            <aside className="feed-right-sidebar">
                {/* Trending Topics */}
                <div className="glass-card">
                    <h3 className="sidebar-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                        Trending Topics
                    </h3>
                    {trendingTopics.length > 0 ? (
                        <div className="trending-list">
                            {trendingTopics.map((topic, i) => (
                                <div key={topic.tag} className="trending-item">
                                    <span className="trending-rank">#{i + 1}</span>
                                    <div className="trending-info">
                                        <span className="trending-tag">{topic.tag}</span>
                                        <span className="trending-count">{topic.count} posts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted text-sm" style={{ padding: '12px 0' }}>No trending topics yet. Start posting with #hashtags!</p>
                    )}
                </div>

                {/* Suggested Friends */}
                <div className="glass-card">
                    <h3 className="sidebar-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                        Suggested Friends
                    </h3>
                    {suggestedUsers && suggestedUsers.length > 0 ? (
                        <div className="suggested-list">
                            {suggestedUsers.map((u: any) => (
                                <Link key={u.id} href={`/profile/${u.username}`} className="suggested-user">
                                    <div className="w-10 h-10 avatar text-xs flex-shrink-0">
                                        {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : getInitials(u.full_name || u.username)}
                                    </div>
                                    <div className="suggested-user-info">
                                        <span className="suggested-name">{u.full_name || u.username}</span>
                                        <span className="suggested-username">@{u.username}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted text-sm" style={{ padding: '12px 0' }}>No suggestions right now</p>
                    )}
                </div>
            </aside>
        </div>
    );
}
