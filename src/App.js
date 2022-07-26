import {Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Sidebar from './Sidebar/Sidebar';
import Main from './Main/Main';
import Search from './Search/Search';
import Library from './Main/Library';
import Editor from './Main/Editor';
import Storage from './Main/Storage';
import Notfound from './Main/Notfound';
import Footer from './Footer/Footer';

function App() {
  return (
    <div className="container">
      <Sidebar />
      <Footer />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/search" element={<Search />} />
        <Route path="/library" element={<Library />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
