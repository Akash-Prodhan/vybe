'use client';

import { useState } from 'react';
import { toggleLike, addComment, deletePost, editPost } from '@/app/(main)/actions';
import { formatRelativeTime, getInitials } from '@/lib/utils';
import Link from 'next/link';

interface PostCardProps {
    post: {
        id: string;
        content: string | null;
        image_url: string | null;
        created_at: string;
        updated_at: string;
        user_id: string;
        profiles: {
            username: string;
            full_name: string | null;
            avatar_url: string | null;
        };
        likes: { user_id: string }[];
        comments: {
            id: string;
            content: string;
            created_at: string;
            user_id: string;
            profiles: {
                username: string;
                avatar_url: string | null;
            };
        }[];
    };
    currentUserId: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content || '');
    const [loading, setLoading] = useState(false);

    const isLiked = post.likes.some((l) => l.user_id === currentUserId);
    const isOwner = post.user_id === currentUserId;

    async function handleLike() {
        await toggleLike(post.id);
    }

    async function handleComment(e: React.FormEvent) {
        e.preventDefault();
        if (!commentText.trim()) return;
        setLoading(true);
        await addComment(post.id, commentText);
        setCommentText('');
        setLoading(false);
    }

    async function handleDelete() {
        if (confirm('Delete this post?')) {
            await deletePost(post.id);
        }
    }

    async function handleEdit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        await editPost(post.id, editContent);
        setIsEditing(false);
        setLoading(false);
    }

    const profile = post.profiles;

    return (
        <div className="card p-4 mb-3 fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <Link href={`/profile/${profile.username}`} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 avatar text-xs bg-bg-tertiary">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                            getInitials(profile.full_name || profile.username)
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold group-hover:underline">{profile.full_name || profile.username}</p>
                        <p className="text-xs text-secondary">@{profile.username} · {formatRelativeTime(post.created_at)}</p>
                    </div>
                </Link>

                {isOwner && (
                    <div className="flex items-center gap-1">
                        <button onClick={() => setIsEditing(!isEditing)} className="btn btn-ghost p-1.5" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button onClick={handleDelete} className="btn btn-ghost p-1.5 hover:text-danger" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            {isEditing ? (
                <form onSubmit={handleEdit} className="mb-3">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="input min-h-[80px] resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                        <button type="submit" disabled={loading} className="btn btn-primary text-xs px-3 py-1.5">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary text-xs px-3 py-1.5">Cancel</button>
                    </div>
                </form>
            ) : (
                post.content && <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
            )}

            {/* Image */}
            {post.image_url && (
                <div className="rounded-xl overflow-hidden mb-3">
                    <img src={post.image_url} alt="Post" className="w-full max-h-96 object-cover" />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2 border-t border-border-light">
                <button
                    onClick={handleLike}
                    className={`btn btn-ghost px-3 py-1.5 text-sm gap-1.5 ${isLiked ? 'text-danger' : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                    {post.likes.length > 0 && post.likes.length}
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="btn btn-ghost px-3 py-1.5 text-sm gap-1.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                    {post.comments.length > 0 && post.comments.length}
                </button>
            </div>

            {/* Comments section */}
            {showComments && (
                <div className="mt-3 pt-3 border-t border-border-light slide-up">
                    {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2 mb-3">
                            <div className="w-6 h-6 avatar text-[8px] bg-bg-tertiary flex-shrink-0 mt-0.5">
                                {comment.profiles.avatar_url ? (
                                    <img src={comment.profiles.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                                ) : (
                                    getInitials(comment.profiles.username)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs">
                                    <Link href={`/profile/${comment.profiles.username}`} className="font-semibold hover:underline">@{comment.profiles.username}</Link>
                                    <span className="text-secondary ml-2">{formatRelativeTime(comment.created_at)}</span>
                                </p>
                                <p className="text-sm mt-0.5">{comment.content}</p>
                            </div>
                        </div>
                    ))}

                    <form onSubmit={handleComment} className="flex gap-2 mt-2">
                        <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="input flex-1 py-2 text-xs"
                        />
                        <button type="submit" disabled={loading || !commentText.trim()} className="btn btn-primary py-2 px-3 text-xs">
                            Post
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
