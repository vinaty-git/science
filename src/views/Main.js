import articles from '../data/content.json'
import '../styles/landing.scss';

function Main() {
 return(
    <div className="main main--expanded">
        {articles.map((item, i) => 
            <section key={i}>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
                <a href="/#">{item.url}</a>
            </section>
        )
        }
    </div>
 );   
}

export default Main;