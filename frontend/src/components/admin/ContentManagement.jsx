import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';
import { PhotoIcon, CalendarIcon, MegaphoneIcon, TrophyIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [galleryImages, setGalleryImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
    loadStats();
  }, [activeTab]);

  const loadContent = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    
    try {
      if (activeTab === 'gallery') {
        // Sample gallery data for demo
        const sampleGallery = [
          { id: 1, title: 'School Building', category: 'campus', image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400', description: 'Our beautiful campus' },
          { id: 2, title: 'Library', category: 'campus', image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400', description: 'State-of-the-art library' },
          { id: 3, title: 'Annual Day 2024', category: 'events', image_url: 'https://images.unsplash.com/photo-1517457373110-98d50a27e7ad?w=400', description: 'Annual Day celebration' },
        ];
        setGalleryImages(sampleGallery);
      } else if (activeTab === 'events') {
        const sampleEvents = [
          { id: 1, title: 'Annual Sports Day', description: 'Inter-school competition', event_date: '2025-01-15', venue: 'Sports Complex', event_type: 'sports' },
          { id: 2, title: 'Parent-Teacher Meeting', description: 'Quarterly review', event_date: '2024-12-20', venue: 'Auditorium', event_type: 'academic' },
        ];
        setEvents(sampleEvents);
      } else if (activeTab === 'notices') {
        const sampleNotices = [
          { id: 1, title: 'Winter Break Announcement', content: 'School closed from Dec 25 to Jan 1', notice_type: 'holiday', priority: 1, views_count: 150 },
          { id: 2, title: 'Admissions Open', content: 'Applications for 2025-26 are now open', notice_type: 'important', priority: 2, views_count: 300 },
        ];
        setNotices(sampleNotices);
      } else if (activeTab === 'achievements') {
        const sampleAchievements = [
          { id: 1, title: 'National Science Olympiad Winner', description: 'Gold medal in Physics', student_name: 'Rahul Sharma', class_name: '10', achievement_type: 'academic' },
          { id: 2, title: 'State Level Football Champion', description: 'Best Player Award', student_name: 'Amit Kumar', class_name: '9', achievement_type: 'sports' },
        ];
        setAchievements(sampleAchievements);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStats({
        total_images: 10,
        total_events: 5,
        active_notices: 3,
        total_achievements: 8
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      toast.success('Deleted successfully');
      loadContent();
    }
  };

  const statCards = [
    { title: 'Gallery Images', value: stats.total_images || 0, icon: PhotoIcon, color: 'bg-pink-500' },
    { title: 'Upcoming Events', value: stats.total_events || 0, icon: CalendarIcon, color: 'bg-blue-500' },
    { title: 'Active Notices', value: stats.active_notices || 0, icon: MegaphoneIcon, color: 'bg-yellow-500' },
    { title: 'Achievements', value: stats.total_achievements || 0, icon: TrophyIcon, color: 'bg-green-500' },
  ];

  const tabs = [
    { id: 'gallery', name: 'Gallery', icon: PhotoIcon },
    { id: 'events', name: 'Events', icon: CalendarIcon },
    { id: 'notices', name: 'Notices', icon: MegaphoneIcon },
    { id: 'achievements', name: 'Achievements', icon: TrophyIcon },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading content...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-gray-600 mt-1">Manage gallery, events, notices, and achievements</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">{card.value}</span>
              </div>
              <h3 className="text-gray-600 mt-4">{card.title}</h3>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <div className="flex space-x-4 px-6 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Gallery View */}
            {activeTab === 'gallery' && (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleryImages.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">No images in gallery</div>
                ) : (
                  galleryImages.map(image => (
                    <div key={image.id} className="group relative">
                      <img src={image.image_url} alt={image.title} className="w-full h-48 object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                        <button onClick={() => deleteItem(image.id)} className="text-white hover:text-red-400">
                          <TrashIcon className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-semibold">{image.title}</h4>
                        <p className="text-sm text-gray-500 capitalize">{image.category}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Events View */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No events found</div>
                ) : (
                  events.map(event => (
                    <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold">{event.title}</h3>
                          <p className="text-gray-600 mt-1">{event.description}</p>
                          <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                            <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>
                            <span>📍 {event.venue}</span>
                            <span className="capitalize">{event.event_type}</span>
                          </div>
                        </div>
                        <button onClick={() => deleteItem(event.id)} className="text-red-600">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Notices View */}
            {activeTab === 'notices' && (
              <div className="space-y-4">
                {notices.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No notices found</div>
                ) : (
                  notices.map(notice => (
                    <div key={notice.id} className={`border-l-4 ${
                      notice.priority === 2 ? 'border-red-500' : 
                      notice.priority === 1 ? 'border-yellow-500' : 'border-blue-500'
                    } bg-white p-4 rounded-lg shadow-sm`}>
                      <div className="flex justify-between">
                        <h3 className="text-lg font-bold">{notice.title}</h3>
                        <button onClick={() => deleteItem(notice.id)} className="text-red-600">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-gray-600 mt-2">{notice.content}</p>
                      <div className="flex justify-between mt-3 text-sm text-gray-500">
                        <span>📢 {notice.notice_type}</span>
                        <span>👁️ {notice.views_count} views</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Achievements View */}
            {activeTab === 'achievements' && (
              <div className="grid md:grid-cols-2 gap-6">
                {achievements.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">No achievements recorded</div>
                ) : (
                  achievements.map(achievement => (
                    <div key={achievement.id} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{achievement.title}</h3>
                          <p className="text-gray-600">{achievement.description}</p>
                          <div className="mt-2">
                            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                              🏆 {achievement.achievement_type}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              {achievement.student_name} - Class {achievement.class_name}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => deleteItem(achievement.id)} className="text-red-600">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
