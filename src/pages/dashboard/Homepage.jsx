import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Cookies from 'js-cookie'; // Import js-cookie for session management
import ActionButton from '../../components/ActionButton.jsx';
import { getImagePrefix, projects } from './config.js';
import './HomePage.css';
import { validCredentials } from '../../config/validCredentials.js';
import LoginForm from './LoginForm.jsx'; // Import the new LoginForm component

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(true); // Show login modal initially
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loginFields, setLoginFields] = useState({
    schoolName: '',
    accessCode: '',
    instructorName: '',
    gradeLevel: ''
  });

  const navigate = useNavigate();
  const PROJECTS = projects();

  useEffect(() => {
    // Check if the session cookie is present
    const session = Cookies.get('session_active');
    if (session) {
      setIsAuthenticated(true);
      setLoginModalOpen(false);
    }
  }, []);

  const openCourseModal = (course) => {
    setSelectedCourse(course);
    setModalIsOpen(true);
  };

  const closeCourseModal = () => setModalIsOpen(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFields((prev) => ({ ...prev, [name]: value }));
  };

  const validateLogin = () => {
    const isValid = validCredentials.some(combination =>
      combination.schoolName === loginFields.schoolName &&
      combination.accessCode === loginFields.accessCode &&
      combination.instructorName === loginFields.instructorName &&
      combination.gradeLevel === loginFields.gradeLevel
    );

    if (isValid) {
      Cookies.set('session_active', 'true', { expires: 1 });
      setIsAuthenticated(true);
      setLoginModalOpen(false);
    } else {
      alert('Invalid input. Please try again.');
    }
  };

  const launchSimulator = (course) => {
    if (course) navigate(course.link);
  };

  return (
    <div className="home-page">
      <div className="title-bar">
        <img src={getImagePrefix('fixtures/nws_banner.png')} alt="Company Logo" className="logo" />
      </div>

      <LoginForm 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        loginFields={loginFields} 
        handleLoginChange={handleLoginChange} 
        validateLogin={validateLogin} 
      />

      <Modal isOpen={modalIsOpen} onRequestClose={closeCourseModal} className="modal">
        <ActionButton onClick={closeCourseModal} title="Close" small right />

        <h2>{selectedCourse ? selectedCourse.title : 'Course Details'}</h2>
        <p>{selectedCourse ? selectedCourse.description1 : 'More details about the selected course.'}</p>
        <p>{selectedCourse ? selectedCourse.description2 : ''}</p>

        <ActionButton onClick={() => launchSimulator(selectedCourse)} title="Launch" />
      </Modal>

      <div className="tiles-container">
        {PROJECTS.map((course) => (
          <div key={course.id} className="tile" onClick={() => openCourseModal(course)}>
            <img src={course.image} alt={course.title} className="tile-image" />
            <div className="tile-title">{course.title}</div>
            <div className="tile-details">{course.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
