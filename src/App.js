import { useState, useEffect } from "react";
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
  const [openLogin, setOpenLogin] = useState(false);
  const location = useLocation();

  function SizeMain() {
      document.querySelector('.main').classList.toggle('main--expanded');
  }

  return (
    <div className="container">

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
          openLogin={openLogin}
          setOpenLogin={setOpenLogin}
        />
          
      </CSSTransition>

      : null}

      <Sidebar 
        SizeMain={SizeMain}
      />

      <CSSTransition 
      key={location.key} 
      classNames="slide-main"
      timeout={200}
      in={true}
      appear={true}>

      {/* <BrowserRouter> */}
      <Routes location={location}>
        <Route path="/" element={
          <Main 
          setModalOpen={setModalOpen}
          setOpenLogin={setOpenLogin}
          />
          } 
        />
        <Route path="/search" element={<Search />} />
        <Route path="/library" element={<Library />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
      {/* </BrowserRouter> */}

      </CSSTransition>

      <Footer />

    </div>
  );
}

export default App;
