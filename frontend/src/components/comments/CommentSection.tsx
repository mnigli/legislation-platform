import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiThumbsUp, FiThumbsDown, FiCornerDownLeft, FiTrash2 } from 'react-icons/fi';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import type { Comment } from '../../types';

interface Props {
  billId: string;
}

function CommentCard({ comment, billId, depth = 0 }: { comment: Comment; billId: string; depth?: number }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const voteMutation = useMutation({
    mutationFn: ({ voteType }: { voteType: 'UPVOTE' | 'DOWNVOTE' }) =>
      api.voteComment(comment.id, voteType),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', billId] }),
  });

  const replyMutation = useMutation({
    mutationFn: () => api.createComment(billId, replyContent, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', billId] });
      setReplyContent('');
      setReplyOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteComment(comment.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', billId] }),
  });

  const roleLabel = comment.user.role === 'MK' ? 'ח"כ' : comment.user.role === 'ADMIN' ? 'מנהל' : null;

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1">
          {comment.user.avatarUrl ? (
            <img src={comment.user.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
              {comment.user.name[0]}
            </div>
          )}
          <span className="font-medium text-sm">{comment.user.name}</span>
          {roleLabel && (
            <span className="text-xs bg-knesset-gold/20 text-knesset-blue px-2 py-0.5 rounded-full font-medium">
              {roleLabel}
            </span>
          )}
          <span className="text-xs text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString('he-IL')}
          </span>
        </div>

        <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => voteMutation.mutate({ voteType: 'UPVOTE' })}
            disabled={!user}
            className={`flex items-center gap-1 text-xs transition-colors ${comment.userVote === 'UPVOTE' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FiThumbsUp size={12} /> {comment.upvotes > 0 ? comment.upvotes : ''}
          </button>
          <button
            onClick={() => voteMutation.mutate({ voteType: 'DOWNVOTE' })}
            disabled={!user}
            className={`text-xs transition-colors ${comment.userVote === 'DOWNVOTE' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FiThumbsDown size={12} />
          </button>
          {user && depth === 0 && (
            <button onClick={() => setReplyOpen(!replyOpen)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <FiCornerDownLeft size={12} /> תגובה
            </button>
          )}
          {user && user.id === comment.userId && (
            <button onClick={() => deleteMutation.mutate()} className="text-xs text-gray-400 hover:text-red-500">
              <FiTrash2 size={12} />
            </button>
          )}
        </div>

        {replyOpen && (
          <div className="mt-2 flex gap-2">
            <input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="כתוב תגובה..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button
              onClick={() => replyMutation.mutate()}
              disabled={!replyContent.trim() || replyMutation.isPending}
              className="btn-primary text-sm py-1.5"
            >
              שלח
            </button>
          </div>
        )}
      </div>

      {comment.replies?.map((reply) => (
        <CommentCard key={reply.id} comment={reply} billId={billId} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function CommentSection({ billId }: Props) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['comments', billId],
    queryFn: () => api.getComments(billId),
  });

  const createMutation = useMutation({
    mutationFn: () => api.createComment(billId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', billId] });
      setContent('');
    },
  });

  const comments: Comment[] = data?.data || [];

  return (
    <div className="card">
      <h3 className="font-bold text-lg mb-4">תגובות ({comments.length})</h3>

      {user && (
        <div className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="הוסף תגובה..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
          />
          <button
            onClick={() => createMutation.mutate()}
            disabled={!content.trim() || createMutation.isPending}
            className="btn-primary mt-2 text-sm"
          >
            פרסם תגובה
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">טוען תגובות...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">אין תגובות עדיין. היה הראשון להגיב!</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} billId={billId} />
          ))}
        </div>
      )}
    </div>
  );
}
