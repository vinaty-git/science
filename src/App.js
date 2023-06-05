import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group'
import './styles/App.css';

import InitLoad from './components/InitLoad';
import Sidebar from './components/Sidebar';
import SignUp from './components/signup/SignUp';
import Main from './views/Main';
import Search from './views/Search';
import Library from './views/Library';
import Settings from './views/Settings';
import Notfound from './views/Notfound';
// import Footer from './components/Footer';

function App() {

  const [modalOpen,setModalOpen] = useState(false);
  const [modalStatus,setModalStatus] = useState();
  const [stateSidebar,setStateSidebar] = useState('expanded');
  const [initLoad,setInitLoad] = useState(true);

  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      if (initLoad === true) {
        setInitLoad(false);
      }
    },1000);
  },[]);

  useEffect(() => {
    var savedStateSidebar = localStorage.getItem('sidebar');
    setStateSidebar(savedStateSidebar);
  },[]);

  /**
   * Change modal status
   */
  function changeModalStatus(event) {
    event.stopPropagation();
    var status = event.target.getAttribute('data-modal');
    if (modalOpen === false) {
      setModalOpen(true);
    } else if (modalOpen === true && status === modalStatus) {
      setModalOpen(false);
    }
    setModalStatus(status);
  }



  // Scroll to top if path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>

      {initLoad === true ?
        <InitLoad />
      :
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
          changeModalStatus={changeModalStatus}
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

          <Route path="/" element={ <Navigate to="/search" />} />
            {/* // element={ */}
            {/* // <Main */}
            {/* // changeModalStatus={changeModalStatus} */}
            {/* // setModalOpen={setModalOpen} */}
            {/* // /> */}
            {/* // }  */}
            {/* // /> */}
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Notfound />} />
        </Routes>

        </CSSTransition>
        
        {/* <Footer /> */}

        </div>
      
      </>
      }
    </>
  );
}

export default App;
