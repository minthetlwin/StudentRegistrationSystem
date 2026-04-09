import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { 
  fetchMyNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead
} from '../services/notificationAPI';

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Poll every 30 seconds for better responsiveness
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };


  const getTypeIcon = (type) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'ERROR': return <XCircle className="w-5 h-5 text-rose-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            loadNotifications(); // Refresh on open
          }
        }}
        className="relative p-2 rounded-full text-slate-400 hover:bg-slate-50 transition-all duration-200 group"
      >
        <Bell className={`w-5 h-5 transition-colors ${isOpen ? 'text-indigo-600' : 'group-hover:text-slate-900'}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-[400px] bg-white rounded-2xl shadow-2xl z-40 border border-slate-100 overflow-hidden transform origin-top-right transition-all">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Notifications</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unread: {unreadCount}</p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-400 text-sm font-medium">Checking for updates...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-100">
                    <Bell className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-slate-400 text-sm font-semibold tracking-tight">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                      className={`group p-4 flex items-start space-x-4 transition-all hover:bg-slate-50 cursor-pointer relative ${
                        !notif.isRead ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      {!notif.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                      )}
                      
                      <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${
                        !notif.isRead ? 'bg-white border-indigo-100' : 'bg-slate-50 border-slate-100'
                      }`}>
                        {getTypeIcon(notif.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-bold truncate tracking-tight ${
                            !notif.isRead ? 'text-slate-900' : 'text-slate-600'
                          }`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                            {formatTime(notif.createdAt)}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${
                          !notif.isRead ? 'text-slate-700 font-medium' : 'text-slate-500'
                        }`}>
                          {notif.message}
                        </p>
                      </div>
                      
                    </div>
                  ))}
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-50 bg-slate-50/30 text-center">
                <button className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
                  View full history
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
