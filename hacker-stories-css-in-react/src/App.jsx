import React from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
import './App.css';
import PropTypes from 'prop-types';

const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
// careful: notice the ? in between

const getUrl = (searchTerm,page) => `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const removeStory = 'REMOVE_STORY';
const storiesFecthInit = 'STORIES_FETCH_INIT';
const storiesFetchSuccess = 'STORIES_FETCH_SUCCESS';
const storiesFetchFailure = 'STORIES_FETCH_FAILURE';
const SORTS = {NONE:(list) => list,
               TITLE:(list) => sortBy(list,'title'),
               AUTHOR:(list) => sortBy(list,'author'),
               COMMENT:(list) => sortBy(list,'num_comments').reverse(),
               POINT:(list) => sortBy(list,'points').reverse(),};
               
const getSumComments = (stories) => {
  console.log('C');
  return stories.data.reduce((result,value) => result + value.num_comments,0);
};

const extractSearchTerm = (url) => url.substring(url.lastIndexOf('?') + 1,url.lastIndexOf('&')).replace(PARAM_SEARCH,'');
const getLastSearches = (urls) => urls.reduce((result,url,index) => {
  const searchTerm = extractSearchTerm(url);
  if(index === 0){
    return result.concat(searchTerm);
  }
 const previousSearchTerm = result[result.length - 1];
 if(searchTerm == previousSearchTerm){
  return result;
 } else {
  return result.concat(searchTerm);
 }
},[]).slice(-6).slice(0,-1);

const storiesReducer = (state,action) => {
  switch(action.type){
    case storiesFecthInit:
      return {
        ...state,isLoading:true,isError:false,
      };
    case storiesFetchSuccess:
      return {
        ...state,isLoading:false,isError:false,data:action.payload.page===0?action.payload.list:state.data.concat(action.payload.list),page:action.payload.page,
      };
    case storiesFetchFailure:
      return {
        ...state,isLoading:false,isError:true,
      };
    case removeStory:
      return {
        ...state,data:state.data.filter(story => action.payload.objectID !==story.objectID),
      };
    default:
      throw new Error();
  }
};

const useStorageState = (key,initialState) => {

  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    if(!isMounted.current){
      isMounted.current = true;
    } else {
      console.log('A');
      localStorage.setItem(key, value); 
    }
  }, [value, key]);
  return [value, setValue];
}; 

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('search','React');

  const[urls,setUrls] = React.useState([getUrl(searchTerm,0)]);
  
  const [stories, dispatchStories] = React.useReducer(storiesReducer,{data:[],page:0,isLoading:false,isError:false});

  const handleFetchStories = React.useCallback(async() => { 
    dispatchStories({type:storiesFecthInit});
    try{
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);
      dispatchStories({
        type:storiesFetchSuccess,
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
      });}catch{
        dispatchStories({type:storiesFetchFailure});
      }
    },[urls]);

  React.useEffect(()=>{
    handleFetchStories();
  },[handleFetchStories]);

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm,stories.page + 1);
  }

  const handleRemoveStory = React.useCallback((item) => {
    dispatchStories({
      type: removeStory,
      payload: item,
    });
  },[]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (searchTerm,page) => {
    const url = getUrl(searchTerm,page);
    setUrls(urls.concat(url));
  };

  const handleSearchSubmit = (event) => {
    handleSearch(searchTerm,0);
    event.preventDefault();
  };

  const handleLastSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm,0);
  };

  console.log('B:App');
  const sumComments = React.useMemo(() => getSumComments(stories),[stories]);
  const lastSearches = getLastSearches(urls);
  return(
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories with {sumComments} comments.</h1>
      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} buttonClassName="button_large"/>
      <LastSearches lastSearches={lastSearches} onLastSearch={handleLastSearch} />
      {stories.isError && <p>Something went wrong...</p>}
      <List list={stories.data} onRemoveItem={handleRemoveStory}/>
      {stories.isLoading?(
        <p>Loading...</p>
      ):(
        <button className="button" type="button" onClick={handleMore}>
          More
        </button>
      )}
    </div>
  ); 
}; 

const LastSearches = ({lastSearches,onLastSearch}) => {
  return(
    <>
      {lastSearches.map((searchTerm,index) => (
        <button className="button" key={searchTerm + index} type="button" onClick={()=>onLastSearch(searchTerm)}>{searchTerm}</button>
      ))}
    </>
  );
}

const SearchForm = ({searchTerm,onSearchInput,onSearchSubmit,buttonClassName}) => {
  return(
    <form onSubmit={onSearchSubmit} className="search-form">
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={onSearchInput}>
        <strong>Search:</strong>
      </InputWithLabel>
      <button type="submit" disabled={!searchTerm} className={`button ${buttonClassName}`}>
        Submit
      </button>
    </form>
  );
};

const InputWithLabel = ({id,value, type='text',onInputChange,isFocused,children,}) => {
  const handleBlur = (event) => {
    console.log(event.target.value);
    console.log(inputRef)
  };

  const inputRef = React.useRef();

  React.useEffect(() => {
    if(isFocused && inputRef.current){
      inputRef.current.focus();
    }
  },[isFocused]);

  return(
    <>
      <label htmlFor={id} className="label">{children}</label>&nbsp;
      <input ref={inputRef} id={id} type={type} value={value} onBlur={handleBlur} onChange={onInputChange} className="input" />
    </>
  );
};

const List = React.memo(({list, onRemoveItem}) => {

  const [sort, setSort] = React.useState({sortKey:'NONE',isReverse:false});

  const handleSort = (sortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({sortKey,isReverse});
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse ? sortFunction(list).reverse() : sortFunction(list);

  return(
    console.log('B:List')||
    <ul>
      <li style={{display:'flex'}}>
        <span style={{width:'40%'}}>
          <button className="button" type="button" onClick={() => handleSort('TITLE')}>
          Title
          </button>
        </span>
        <span style={{width: '30%'}}>
          <button className="button" type="button" onClick={() => handleSort('AUTHOR')}>
          Author
          </button>
        </span>
        <span style={{width: '10%'}}>
          <button className="button" type="button" onClick={() => handleSort('COMMENT')}>
          Comments
          </button>
          </span>
        <span style={{width: '10%'}}>
          <button  className="button" type="button" onClick={() => handleSort('POINT')}>
          Points
          </button>
        </span>
        <span style={{width:'10%'}}>Actions</span>
      </li> 
      {sortedList.map((item) => (
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        ))}
    </ul>
  );
});

const Item = ({item, onRemoveItem}) => {
  return (
    <li className="item">
        <span style={{width:'40%'}}>
        <a href={item.url}>{item.title}</a>
        </span>
        <span style={{width:'30%'}}>Author:{item.author}</span>
        <span style={{width:'10%'}}>Number of comments:{item.num_comments}</span>
        <span style={{width:'10%'}}>Points:{item.points}</span>
        <span style={{width:'10%'}}><button type="button" onClick={() => onRemoveItem(item)} className="button button_small">Dismiss</button></span>
    </li>
  );
};

SearchForm.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchInput: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
  buttonClassName: PropTypes.string.isRequired,
};

InputWithLabel.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
  onInputChange: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

List.propTypes = {
  list: PropTypes.array.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

Item.propTypes = {
  item: PropTypes.object.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

LastSearches.propTypes = {
  lastSearches: PropTypes.array.isRequired,
  onLastSearch: PropTypes.func.isRequired,
}

List.displayName = 'List'

export default App;
