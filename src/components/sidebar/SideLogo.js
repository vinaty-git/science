import Logo from '../../icons/logo-tree.png';

function SideLogo(props) {
    const {stateSidebar} = props;
    return (
        <div className={stateSidebar=== 'collapsed' ? 'sm-logo' : 'logo'}>
            <img src={Logo} />
            <div className={stateSidebar=== 'collapsed' ? 'sm-logo__text' : 'logo__text'}>
                <h1>Scholar</h1>
                <p>Science search engine</p>
            </div>
        </div>
    );
}

export default SideLogo;