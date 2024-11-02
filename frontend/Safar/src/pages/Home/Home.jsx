import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import Modal from "react-modal";
import { ToastContainer, toast } from 'react-toastify';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../../components/Navbar';
import TravelStoryCard from '../../components/cards/TravelStoryCard';
import EmptyCard from '../../components/cards/EmptyCard';
import FilterInfoTitle from '../../components/cards/FilterInfoTitle';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import { getEmptyCardImg, getEmptyCardMessage } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 999,
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get('/get-all-stories');
      if (response.data?.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const updateIsFavorite = async (storyData) => {
    try {
      const response = await axiosInstance.put(`/update-is-favorite/${storyData._id}`, {
        isFavorite: !storyData.isFavorite,
      });
      
      if (response.data?.story) {
        toast.success("Story updated successfully");
        
        if (filterType === 'search' && searchQuery) {
          onSearchStory(searchQuery);
        } else if (filterType === 'date') {
          filterStoriesByDate(dateRange);
        } else {
          getAllTravelStories();
        }
      }
    } catch (error) {
      toast.error("Failed to update story");
      console.error('Error updating favorite:', error);
    }
  };

  const deleteTravelStory = async (data) => {
    try {
      const response = await axiosInstance.delete(`/delete-story/${data._id}`);
      if (response.data && !response.data.story) {
        toast.error("Story deleted successfully");
        setOpenViewModal(prev => ({ ...prev, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      toast.error("Failed to delete story");
      console.error('Error deleting story:', error);
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get('/search', {
        params: { query }
      });
      if (response.data?.stories) {
        setFilterType('search');
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error('Error searching stories:', error);
    }
  };

  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const response = await axiosInstance.get('/travel-stories/filter', {
          params: { startDate, endDate }
        });
        if (response.data?.stories) {
          setFilterType('date');
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      console.error('Error filtering stories:', error);
    }
  };

  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType('');
    getAllTravelStories();
  };

  const handleClearSearch = () => {
    setFilterType('');
    setSearchQuery('');
    getAllTravelStories();
  };

  const handleEdit = (data) => {
    setOpenAddEditModal({
      isShown: true,
      type: 'edit',
      data,
    });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({
      isShown: true,
      data,
    });
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  const renderStoryGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {allStories.map((item) => (
        <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <div className="relative h-48">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => updateIsFavorite(item)}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg 
                className={`w-5 h-5 ${item.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                fill={item.isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{item.story}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {new Date(item.visitedDate).toLocaleDateString()}
              </span>
              <button 
                onClick={() => handleViewStory(item)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                View Story
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // const renderEmptyState = () => (
  //   <div className="text-center py-16 bg-white rounded-xl shadow-sm">
  //     <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
  //       <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  //       </svg>
  //     </div>
  //     <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Your Travel Journey</h3>
  //     <p className="text-gray-600 mb-6">Create your first travel story by clicking the add button</p>
  //     <button
  //       onClick={() => setOpenAddEditModal({ isShown: true, type: 'add', data: null })}
  //       className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors inline-flex items-center gap-2"
  //     >
  //       <MdAdd className="text-xl" />
  //       Add Story
  //     </button>
  //   </div>
  // );


  // ... (previous imports remain the same)

const renderEmptyState = () => {
  // If we're filtering (by search or date), show the EmptyCard
  if (filterType === 'search' || filterType === 'date') {
    return (
      <EmptyCard
        imgSrc={getEmptyCardImg(filterType)}
        message={getEmptyCardMessage(filterType)}
      />
    );
  }

  // Otherwise show the "Start Journey" empty state
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Your Travel Journey</h3>
      <p className="text-gray-600 mb-6">Create your first travel story by clicking the add button</p>
      <button
        onClick={() => setOpenAddEditModal({ isShown: true, type: 'add', data: null })}
        className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors inline-flex items-center gap-2"
      >
        <MdAdd className="text-xl" />
        Add Story
      </button>
    </div>
  );
};

// ... (rest of the code remains the same)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Travel Stories</h1>
          <p className="text-gray-600 mt-2">Capture and relive your amazing adventures</p>
        </div>

        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={resetFilter}
        />

        <div className="flex gap-8">
          <div className="flex-1">
            {allStories.length > 0 ? renderStoryGrid() : renderEmptyState()}
          </div>

          <div className="w-[350px] shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="rdp">
                <DayPicker
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  className="!font-sans"
                  classNames={{
                    cell: "!text-sm",
                    day: "h-10 w-10 rounded-full hover:bg-cyan-50 focus:bg-cyan-50 focus:outline-none",
                    selected: "!bg-cyan-500 !text-white hover:bg-cyan-600",
                    today: "bg-gray-100",
                    head_cell: "text-gray-500 font-medium text-sm"
                  }}
                  styles={{
                    caption: { color: '#374151' },
                    nav_button_previous: { color: '#374151' },
                    nav_button_next: { color: '#374151' }
                  }}
                />
              </div>
              {dateRange.from && dateRange.to && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={resetFilter}
                    className="w-full px-4 py-2 text-sm text-cyan-600 border border-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors"
                  >
                    Clear Date Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
        style={modalStyles}
        appElement={document.getElementById('root')}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => setOpenViewModal(prev => ({ ...prev, isShown: false }))}
        style={modalStyles}
        appElement={document.getElementById('root')}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data}
          onClose={() => setOpenViewModal(prev => ({ ...prev, isShown: false }))}
          onEditClick={() => {
            setOpenViewModal(prev => ({ ...prev, isShown: false }));
            handleEdit(openViewModal.data);
          }}
          onDeleteClick={() => deleteTravelStory(openViewModal.data)}
        />
      </Modal>

      {/* Add Button */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-cyan-500 text-white rounded-full shadow-lg hover:bg-cyan-600 transition-colors flex items-center justify-center group"
        onClick={() => setOpenAddEditModal({ isShown: true, type: 'add', data: null })}
        aria-label="Add new story"
      >
        <MdAdd className="text-2xl group-hover:scale-110 transition-transform" />
      </button>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Home;