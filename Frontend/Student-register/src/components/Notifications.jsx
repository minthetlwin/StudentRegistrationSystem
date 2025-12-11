import React, { useState } from 'react';

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Course Registration Open', message: 'Register for semester courses', time: '2 hours ago', unread: true },
    { id: 2, title: 'Exam Schedule Released', message: 'Check your exam timetable', time: '1 day ago', unread: true },
    { id: 3, title: 'Fee Payment Reminder', message: 'Pay your semester fees', time: '3 days ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                      notif.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{notif.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                      </div>
                      {notif.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
