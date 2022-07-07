import SearchQuery from './SearchQuery';

function Search() {
    return (
        <div className='main'>
            <div className='search'>
                <div className='search__heading block'>
                    <h2>Search for Articles</h2>
                </div>
                <div><SearchQuery /></div>
            </div>
        </div>
    )
}

export default Search;