// import React from 'react';
// import LOGO from '../assets/images/logo.png';
// import ProfileInfo from './cards/ProfileInfo';
// import { useNavigate } from 'react-router-dom';
// import SearchBar from './Input/SearchBar';

// const Navbar = ({ 
//     userInfo,
//     searchQuery,
//     setSearchQuery,
//     onSearchNote,
//     handleClearSearch
// }) => {
//     const isToken = localStorage.getItem('token');
//     const navigate = useNavigate();

//     const onLogOut = () => {
//         localStorage.clear();
//         navigate('/login');
//     };

//     const handleSearch = () => {
//         if (searchQuery) {
//             onSearchNote(searchQuery);
//         }
//     };

//     const onClearSearch = () => {
//         handleClearSearch();
//         setSearchQuery('');
//     };

//     return (
//         <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 drop-shadow-lg sticky top-0 z-10">
//             <div className="flex items-center justify-between">
//                 <img 
//                     src={LOGO} 
//                     alt="Safar" 
//                     className="h-10 cursor-pointer transition-transform transform hover:scale-105" 
//                 />

//                 {isToken && (
//                     <>
//                         <div className="flex-grow max-w-xl mx-4 text-large text-black">
//                             <SearchBar
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 handleSearch={handleSearch}
//                                 onClearSearch={onClearSearch}
//                             />
//                         </div>

//                         <div className="flex items-center space-x-4">
//                             <ProfileInfo userInfo={userInfo} />
//                             <button
//                                 onClick={onLogOut}
//                                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//                             >
//                                 Logout
//                             </button>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;




import React from 'react';
import LOGO from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import SearchBar from './Input/SearchBar';
import ProfileSection from './ProfileSection';

const Navbar = ({ 
    userInfo,
    searchQuery,
    setSearchQuery,
    onSearchNote,
    handleClearSearch
}) => {
    const isToken = localStorage.getItem('token');
    const navigate = useNavigate();

    const onLogOut = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSearch = () => {
        if (searchQuery) {
            onSearchNote(searchQuery);
        }
    };

    const onClearSearch = () => {
        handleClearSearch();
        setSearchQuery('');
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 drop-shadow-lg sticky top-0 z-10">
            <div className="flex items-center justify-between">
                <img 
                    src={LOGO} 
                    alt="Safar" 
                    className="h-10 cursor-pointer transition-transform transform hover:scale-105" 
                />

                {isToken && (
                    <>
                        <div className="flex-grow max-w-xl mx-4 text-black text-large">
                            <SearchBar
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                handleSearch={handleSearch}
                                onClearSearch={onClearSearch}
                            />
                        </div>

                        <ProfileSection 
                            userInfo={userInfo}
                            onLogOut={onLogOut}
                        />
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;