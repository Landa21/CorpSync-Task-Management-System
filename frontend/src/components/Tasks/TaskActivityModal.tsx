import { X, Send, Clock, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { Task } from '../../types';

interface TaskActivityModalProps {
    task: Task;
    onClose: () => void;
}

export const TaskActivityModal: React.FC<TaskActivityModalProps> = ({ task, onClose }) => {
    const { user: currentUser } = useAuth();
    const { addComment, users } = useTasks();
    const [commentText, setCommentText] = useState('');

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        addComment(task.id, commentText);
        setCommentText('');
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="glass-card max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">{task.title}</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Task Activity Dashboard</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Description Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={14} /> Description & Scope
                        </h3>
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm leading-relaxed">
                            {task.description}
                        </div>
                    </div>

                    {/* Rejection Alert if applicable */}
                    {task.rejectionReason && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                            <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Rejection Feedback</h4>
                            <p className="text-sm text-slate-300 italic">"{task.rejectionReason}"</p>
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare size={14} /> Discussion Thread
                        </h3>

                        <div className="space-y-4">
                            {task.comments.length > 0 ? task.comments.map((comment) => {
                                const author = users.find(u => u.id === comment.authorId);
                                const isMe = author?.id === currentUser?.id;

                                return (
                                    <div key={comment.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <img
                                            src={author?.avatar}
                                            alt=""
                                            className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-800"
                                        />
                                        <div className={`max-w-[80%] space-y-1 ${isMe ? 'items-end' : ''}`}>
                                            <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                <span className="text-[10px] font-black text-white uppercase tracking-tight">{author?.name}</span>
                                                <span className="text-[8px] text-slate-500 font-bold">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={`p-3 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-300 rounded-tl-none'
                                                }`}>
                                                {comment.text}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-center py-10 opacity-40">
                                    <MessageSquare size={40} className="mx-auto mb-3 text-slate-700" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">No active discussions</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comment Input */}
                <form onSubmit={handleSubmitComment} className="p-6 border-t border-slate-800 bg-slate-900/30">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Type a message or provide feedback..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-4 text-white focus:outline-none focus:border-indigo-500 font-medium text-sm"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all active:scale-90"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
