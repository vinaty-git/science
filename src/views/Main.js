import articles from '../data/content.json'
import '../styles/landing.scss';

function Main() {
 return(
    <div className="main main--expanded">
        <div className='main__heading block'>
            Header

        </div>

        <div className='main__search block'>
            Search

        </div>

        <div className='main__search block'>
            Hero block

        </div>

        <div className='main__search block'>
            Pluses

        </div>


        {/* {articles.map((item, i) => 
            <section key={i}>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
                <a href="/#">{item.url}</a>
            </section>
        )
        } */}
    </div>
 );   
}

export default Main;