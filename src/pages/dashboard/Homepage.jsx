import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Cookies from 'js-cookie'; // Import js-cookie for session management
import ActionButton from '../../components/ActionButton.jsx';
import { getImagePrefix, projects } from './config.js';
import './HomePage.css';

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(true); // Show login modal initially
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loginFields, setLoginFields] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: ''
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
    const validStrings = ['a', 'a', 'a', 'a', 'a'];
    const isValid = Object.values(loginFields).every((value, index) => value === validStrings[index]);

    if (isValid) {
      Cookies.set('session_active', 'true', { expires: 1 }); // Set session cookie
      setIsAuthenticated(true);
      setLoginModalOpen(false);
    } else {
      alert('Invalid input. Please try again.');
    }
  };

  const launchSimulator = (course) => {
    if (course) navigate(course.link);
  };

  if (!isAuthenticated) {
    return (
      <Modal isOpen={loginModalOpen} className="modal" ariaHideApp={false}>
        <h2>Login Required</h2>
        <form>
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="login-field">
              <label>Field {index + 1}:</label>
              <input
                type="text"
                name={`field${index + 1}`}
                value={loginFields[`field${index + 1}`]}
                onChange={handleLoginChange}
              />
            </div>
          ))}
          <ActionButton onClick={validateLogin} title="Login" />
        </form>
      </Modal>
    );
  }

  return (
    <div className="home-page">
      <div className="title-bar">
        <img src={getImagePrefix('fixtures/nws_banner.png')} alt="Company Logo" className="logo" />
      </div>

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
