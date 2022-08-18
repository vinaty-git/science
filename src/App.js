import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group'
import './styles/App.css';

import Sidebar from './components/Sidebar';
import SignUp from './components/signup/SignUp';
import Main from './views/Main';
import Search from './views/Search';
import Library from './views/Library';
import Settings from './views/Settings';
import Notfound from './views/Notfound';
import Footer from './components/Footer';

function App() {

  const [modalOpen,setModalOpen] = useState(false);
  const [modalStatus,setModalStatus] = useState();
  const [stateSidebar,setStateSidebar] = useState('');


  const location = useLocation();

  useEffect(() => {
      if (window.location.pathname === '/') {
          setStateSidebar('collapsed');
      } else {
          setStateSidebar('expanded');
      }
  },[]);

  /**
   * Change modal status
   */
  function changeModalStatus(event) {
    var status = event.target.getAttribute('data-modal');
    if (modalOpen === false) {
      setModalOpen(true);
    }
    setModalStatus(status);
  }

  return (
    // <div className="container">
    <>
      {modalOpen === true ?
        
      <CSSTransition 
      key={location.key.modal} 
      classNames="modal_sign"
      timeout={0}
      in={true}
      appear={true}
      >

        <SignUp 
          setModalOpen={setModalOpen}
          modalStatus={modalStatus}
          changeModalStatus={changeModalStatus}
        />
          
      </CSSTransition>

      : null}

      <Sidebar 
        // SizeMain={SizeMain}
        stateSidebar={stateSidebar}
        setStateSidebar={setStateSidebar}
      />

      <div className={`container ${stateSidebar === 'collapsed' ? 'container--expanded' : ''}`}>

      <CSSTransition 
      key={location.key} 
      classNames="slide-main"
      timeout={200}
      in={true}
      appear={true}>

      <Routes location={location}>
        <Route path="/" element={
          <Main
          changeModalStatus={changeModalStatus}
          setModalOpen={setModalOpen}
          />
          } 
        />
        <Route path="/search" element={<Search />} />
        <Route path="/library" element={<Library />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Notfound />} />
      </Routes>

      </CSSTransition>
      
      <Footer />

      </div>
    </>
    // </div>
  );
}

export default App;
