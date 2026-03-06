'use client';

import { useState } from 'react';
import { toggleLike, addComment, deletePost, editPost } from '@/app/(main)/actions';
import { getInitials, formatRelativeTime, cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PostCardProps { post: any; currentUserId: string; }

function isVideoUrl(url: string) { return /\.(mp4|webm|ogg|mov)$/i.test(url); }

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

    async function handleLike() { setLiked(!liked); setLikeCount((c: number) => liked ? c - 1 : c + 1); await toggleLike(post.id); }
    async function handleComment(e: React.FormEvent) { e.preventDefault(); if (!newComment.trim()) return; await addComment(post.id, newComment.trim()); setNewComment(''); router.refresh(); }
    async function handleDelete() { await deletePost(post.id); router.refresh(); }
    async function handleEdit() { await editPost(post.id, editContent); setEditing(false); router.refresh(); }

    return (
        <div className="card p-0 mb-4 overflow-hidden fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2">
                <Link href={`/profile/${profile?.username}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 avatar text-xs flex-shrink-0">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : getInitials(profile?.full_name || profile?.username || '')}
                    </div>
                    <div>
                        <p className="text-[15px] font-semibold group-hover:text-accent transition-colors">{profile?.full_name || profile?.username}</p>
                        <p className="text-xs text-muted">{formatRelativeTime(post.created_at)} · 🌐</p>
                    </div>
                </Link>

                {isOwner && (
                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="btn btn-ghost p-2 rounded-full text-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 top-9 card p-1.5 min-w-[140px] z-10 scale-in">
                                <button onClick={() => { setEditing(true); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-surface-hover w-full">Edit post</button>
                                <button onClick={() => { handleDelete(); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-danger/5 w-full text-danger">Delete post</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            {editing ? (
                <div className="px-4 pb-2 space-y-2">
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="input resize-none text-sm" rows={3} maxLength={500} />
                    <div className="flex gap-2">
                        <button onClick={handleEdit} className="btn btn-primary text-xs px-4 py-1.5">Save</button>
                        <button onClick={() => setEditing(false)} className="btn btn-secondary text-xs px-4 py-1.5">Cancel</button>
                    </div>
                </div>
            ) : post.content && (
                <p className="text-[15px] leading-relaxed px-4 pb-2 whitespace-pre-wrap">{post.content}</p>
            )}

            {/* Media */}
            {post.image_url && (
                <div className="bg-bg-tertiary border-y border-border-light">
                    {isVideoUrl(post.image_url) ? (
                        <video src={post.image_url} className="w-full max-h-[500px] object-contain" controls playsInline />
                    ) : (
                        <img src={post.image_url} alt="" className="w-full max-h-[500px] object-cover" />
                    )}
                </div>
            )}

            {/* Reaction counts */}
            {(likeCount > 0 || (post.comments?.length > 0)) && (
                <div className="flex items-center justify-between px-4 py-2 text-xs text-muted">
                    {likeCount > 0 && (
                        <span className="flex items-center gap-1">
                            <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" /></svg>
                            </span>
                            {likeCount}
                        </span>
                    )}
                    {post.comments?.length > 0 && (
                        <button onClick={() => setShowComments(!showComments)} className="hover:underline">
                            {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
                        </button>
                    )}
                </div>
            )}

            {/* Actions bar — Facebook style */}
            <div className="flex border-t border-border-light mx-4">
                <button onClick={handleLike} className={cn('flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors rounded-lg my-1', liked ? 'text-accent' : 'text-secondary hover:bg-surface-hover')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" /><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" /></svg>
                    Like
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-secondary hover:bg-surface-hover rounded-lg my-1 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                    Comment
                </button>
            </div>

            {/* Comments */}
            {showComments && (
                <div className="px-4 pb-3 pt-1 slide-up">
                    {post.comments?.map((comment: any) => (
                        <div key={comment.id} className="flex gap-2 mb-2.5">
                            <div className="w-8 h-8 avatar text-[9px] flex-shrink-0 mt-0.5">
                                {comment.profiles?.avatar_url ? <img src={comment.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : getInitials(comment.profiles?.username || '')}
                            </div>
                            <div className="flex-1">
                                <div className="bg-surface-hover rounded-2xl px-3 py-2">
                                    <p className="text-[13px] font-semibold">{comment.profiles?.username}</p>
                                    <p className="text-sm">{comment.content}</p>
                                </div>
                                <p className="text-[11px] text-muted mt-0.5 ml-3">{formatRelativeTime(comment.created_at)}</p>
                            </div>
                        </div>
                    ))}
                    <form onSubmit={handleComment} className="flex gap-2 mt-2">
                        <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="flex-1 bg-surface-hover rounded-full px-4 py-2 text-sm outline-none text-primary placeholder:text-muted focus:ring-2 focus:ring-accent/20" maxLength={280} />
                        <button type="submit" disabled={!newComment.trim()} className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-all', newComment.trim() ? 'bg-accent text-white' : 'bg-bg-tertiary text-muted')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
