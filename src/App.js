import {Routes, Route, Link} from 'react-router-dom';
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

  /**
   * Toggle main container width
   */
  function SizeMain() {
      document.querySelector('.main').classList.toggle('main--expanded');
  }
  
  return (
    <div className="container">
      <Sidebar 
        SizeMain={SizeMain}  
      />
      <Footer />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/search" element={<Search />} />
        <Route path="/library" element={<Library />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
