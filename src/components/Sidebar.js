import Profile from '../components/Profile';
import Menu from '../components/Menu';
import { ReactComponent as Logo } from '../icons/logo.svg'

function Sidebar() {
    return (
        <div className="sidebar">

            <div  className="logo">
                <Logo />
                <div className="logo__text">
                    <h1>Scholar</h1>
                    <p>Description of website</p>
                </div>
            </div>

            <Profile />

            <Menu />
            
        </div>
    );
}
export default Sidebar;