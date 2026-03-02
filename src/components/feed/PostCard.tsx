'use client';

import { useState } from 'react';
import { toggleLike, addComment, deletePost, editPost } from '@/app/(main)/actions';
import { getInitials, formatRelativeTime, cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PostCardProps {
    post: any;
    currentUserId: string;
}

function isVideoUrl(url: string) {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
    const [liked, setLiked] = useState(post.likes?.some((l: any) => l.user_id === currentUserId));
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content || '');
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();
    const isOwner = post.user_id === currentUserId;
    const profile = post.profiles;

    async function handleLike() {
        setLiked(!liked);
        setLikeCount((c: number) => liked ? c - 1 : c + 1);
        await toggleLike(post.id);
    }

    async function handleComment(e: React.FormEvent) {
        e.preventDefault();
        if (!newComment.trim()) return;
        await addComment(post.id, newComment.trim());
        setNewComment('');
        router.refresh();
    }

    async function handleDelete() {
        await deletePost(post.id);
        router.refresh();
    }

    async function handleEdit() {
        await editPost(post.id, editContent);
        setEditing(false);
        router.refresh();
    }

    return (
        <div className="card p-5 mb-4 fade-in">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <Link href={`/profile/${profile?.username}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 avatar text-sm bg-bg-tertiary flex-shrink-0">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            getInitials(profile?.full_name || profile?.username || '')
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold group-hover:text-accent transition-colors">{profile?.full_name || profile?.username}</p>
                        <p className="text-xs text-secondary">@{profile?.username} · {formatRelativeTime(post.created_at)}</p>
                    </div>
                </Link>

                {isOwner && (
                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="btn btn-ghost p-1.5 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 top-8 card p-1 min-w-[120px] z-10 scale-in">
                                <button onClick={() => { setEditing(true); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-bg-secondary w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                    Edit
                                </button>
                                <button onClick={() => { handleDelete(); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-danger/10 text-danger w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            {editing ? (
                <div className="mb-3 space-y-2">
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="input resize-none" rows={3} />
                    <div className="flex gap-2">
                        <button onClick={handleEdit} className="btn btn-primary text-xs px-4 py-1.5">Save</button>
                        <button onClick={() => setEditing(false)} className="btn btn-secondary text-xs px-4 py-1.5">Cancel</button>
                    </div>
                </div>
            ) : (
                post.content && <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
            )}

            {/* Media */}
            {post.image_url && (
                <div className="rounded-xl overflow-hidden mb-3 bg-bg-tertiary">
                    {isVideoUrl(post.image_url) ? (
                        <video src={post.image_url} className="w-full max-h-96 object-contain" controls playsInline />
                    ) : (
                        <img src={post.image_url} alt="" className="w-full max-h-96 object-cover" />
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 pt-1">
                <button onClick={handleLike} className={cn('btn btn-ghost px-3 py-2 rounded-lg text-xs gap-1.5', liked && 'text-rose')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                    {likeCount > 0 && likeCount}
                </button>
                <button onClick={() => setShowComments(!showComments)} className="btn btn-ghost px-3 py-2 rounded-lg text-xs gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                    {post.comments?.length > 0 && post.comments.length}
                </button>
            </div>

            {/* Comments */}
            {showComments && (
                <div className="mt-3 pt-3 border-t border-border-light slide-up">
                    {post.comments?.map((comment: any) => (
                        <div key={comment.id} className="flex gap-2.5 mb-3">
                            <div className="w-7 h-7 avatar text-[10px] bg-bg-tertiary flex-shrink-0">
                                {comment.profiles?.avatar_url ? (
                                    <img src={comment.profiles.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                                ) : (
                                    getInitials(comment.profiles?.username || '')
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs">
                                    <span className="font-semibold">{comment.profiles?.username}</span>{' '}
                                    <span className="text-secondary">{comment.content}</span>
                                </p>
                                <p className="text-[10px] text-secondary/50 mt-0.5">{formatRelativeTime(comment.created_at)}</p>
                            </div>
                        </div>
                    ))}

                    <form onSubmit={handleComment} className="flex gap-2 mt-2">
                        <input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="input text-xs py-2 flex-1"
                            maxLength={500}
                        />
                        <button type="submit" disabled={!newComment.trim()} className="btn btn-primary text-xs px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
