
---

# Safar

Safar is a full-stack travel story application built with the MERN (MongoDB, Express, React, Node.js) stack. Users can document, manage, and share travel stories, organize them by date and favorite them. The app allows users to search and filter stories, add new stories, and edit or delete existing ones.

---

## Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)

---

## Features

- **User Authentication**: Sign up and log in with secure JWT authentication.
- **Create and Manage Stories**: Add, edit, delete, and view travel stories.
- **Search and Filter**: Search stories by keywords or filter by date range.
- **Favorites**: Mark favorite stories to keep track of memorable travels.
- **Responsive Design**: Accessible across devices with a responsive UI.
- **Date Picker**: Use a date range selector for easy filtering by travel dates.

---

## Demo

Recording of the application in action can be found in the [Screenshots](./Screenshots/) folder.

---

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Libraries/Packages**:
  - **axios**: For API requests
  - **react-router-dom**: Routing within the application
  - **react-icons**: Icons for a visually appealing UI
  - **react-day-picker**: Calendar component for date filtering
  - **react-toastify**: Notifications
  - **moment.js**: Date formatting

---

## Screenshots

Screenshots of the application can be found in the [Screenshots](./Screenshots/) folder.

- **Homepage**: Overview of travel stories.
- **Add Story Modal**: Modal to add new travel stories.
- **View Story Modal**: Detailed view of each story.
- **Date Filter**: Sidebar calendar for date filtering.
  
Add screenshots as `png` or `jpg` files inside the `Screenshots` folder and update the links below.

![Homepage](./Screenshots/homepage.png)
![Add Story Modal](./Screenshots/add-story-modal.png)
![View Story Modal](./Screenshots/view-story-modal.png)
![Date Filter](./Screenshots/date-filter.png)

---

## Installation

Follow these instructions to set up and run Safar on your local machine.

### Prerequisites

- Node.js and npm installed
- MongoDB instance (local or cloud)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ajju-raj/safar.git
   cd safar
   ```

2. Navigate to the backend folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the `backend` directory and configure the following environment variables:
   ```plaintext
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend folder and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

2. Start the React development server:
   ```bash
   npm start
   ```

3. Open your browser and go to `http://localhost:5173`.

---

## Usage

- **Home Page**: Displays all travel stories, with options to search and filter.
- **Add/Edit Story**: Use the "+" button to add a new story or edit existing stories from their view modals.
- **Date Filtering**: Use the calendar in the sidebar to filter stories by a date range.
- **Favorites**: Mark stories as favorites for easy access.

---

## API Endpoints

### Auth
- **POST** `/api/auth/signup` - Register a new user.
- **POST** `/api/auth/login` - Login a user and return a JWT.

### Stories
- **GET** `/api/stories` - Fetch all travel stories.
- **POST** `/api/stories` - Create a new travel story.
- **PUT** `/api/stories/:id` - Update an existing story.
- **DELETE** `/api/stories/:id` - Delete a story.
- **PUT** `/api/stories/:id/favorite` - Toggle favorite status of a story.

### Filters
- **GET** `/api/stories/search` - Search stories by keywords.
- **GET** `/api/stories/filter` - Filter stories by date range.

---

## Future Enhancements

- **User Profiles**: Allow users to view and update their profiles.
- **Social Sharing**: Share stories on social media.
- **Geolocation-based Suggestions**: Suggest stories based on the user’s current location.

---

## Deployment

The application can be deployed to platforms like Heroku, Vercel, or Netlify. Make sure to set up environment variables and configure the deployment settings accordingly.
Care Has to be taken while deploying the application as the backend and frontend are in different folders.

---

## Contributing

Contributions are welcome! Fork the repository and make a pull request with your improvements or bug fixes.

---

## License

This project is open-source and available under no license.

---
