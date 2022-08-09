import {Routes, Route, Link, useLocation} from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import './styles/App.css';
import Sidebar from './components/Sidebar';
import Main from './views/Main';
import Search from './views/Search';
import Library from './views/Library';
import Editor from './views/Editor';
import Storage from './views/Storage';
import Settings from './views/Settings';
import Notfound from './views/Notfound';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  /**
   * Toggle main container width
   */
  function SizeMain() {
    // setTimeout(() => {
      document.querySelector('.main').classList.toggle('main--expanded');
    // },200);
  }

  return (
    <div className="container">
      <Sidebar 
        SizeMain={SizeMain}  
      />
      <Footer />

      {/* <TransitionGroup> */}
      <CSSTransition 
      key={location.key} 
      classNames="slide-main"
      timeout={200}
      in={true}
      appear={true}>

      <Routes location={location}>
        <Route path="/" element={<Main />} />
        <Route path="/search" element={<Search />} />
        <Route path="/library" element={<Library />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Notfound />} />
      </Routes>

      </CSSTransition>
      {/* </TransitionGroup> */}

    </div>
  );
}

export default App;
