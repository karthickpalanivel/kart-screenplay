import { useState } from 'react';
import { FaComment, FaTrash, FaPlus } from 'react-icons/fa';

export default function CommentsPanel({ comments, onAddComment, onDeleteComment, selectedBlockId }) {
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddComment = () => {
    if (newComment.trim() && selectedBlockId) {
      onAddComment({
        blockId: selectedBlockId,
        text: newComment.trim(),
        author: 'You',
        timestamp: new Date().toISOString()
      });
      setNewComment('');
    }
  };

  const filteredComments = selectedBlockId
    ? comments.filter(c => c.blockId === selectedBlockId)
    : comments;

  return (
    <div className="comments-panel">
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaComment />
          Comments ({filteredComments.length})
        </h3>
        <span>{isExpanded ? '−' : '+'}</span>
      </div>

      {isExpanded && (
        <>
          <div style={{ marginBottom: '16px' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || !selectedBlockId}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: newComment.trim() && selectedBlockId ? 'pointer' : 'not-allowed',
                opacity: newComment.trim() && selectedBlockId ? 1 : 0.5
              }}
            >
              <FaPlus style={{ marginRight: '4px' }} />
              Add Comment
            </button>
          </div>

          <div>
            {filteredComments.length === 0 ? (
              <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                No comments yet. Select text and add a comment.
              </p>
            ) : (
              filteredComments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '12px', color: '#333' }}>
                      {comment.author || 'Anonymous'}
                    </strong>
                    <button
                      onClick={() => onDeleteComment(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#dc3545',
                        padding: '2px 4px'
                      }}
                      title="Delete comment"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                  <p style={{ fontSize: '14px', margin: 0, color: '#555' }}>
                    {comment.text}
                  </p>
                  {comment.timestamp && (
                    <small style={{ color: '#999', fontSize: '11px' }}>
                      {new Date(comment.timestamp).toLocaleString()}
                    </small>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

