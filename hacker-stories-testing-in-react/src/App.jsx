import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const removeStory = 'REMOVE_STORY';
const storiesFecthInit = 'STORIES_FETCH_INIT';
const storiesFetchSuccess = 'STORIES_FETCH_SUCCESS';
const storiesFetchFailure = 'STORIES_FETCH_FAILURE';


const storiesReducer = (state,action) => {
  switch(action.type){
    case storiesFecthInit:
      return {
        ...state,isLoading:true,isError:false,
      };
    case storiesFetchSuccess:
      return {
        ...state,isLoading:false,isError:false,data:action.payload,
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
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
}; 

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('search','React');

  const[url,setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
  
  const [stories, dispatchStories] = React.useReducer(storiesReducer,{data:[],isLoading:false,isError:false});

  const handleFetchStories = React.useCallback(async() => { 
    dispatchStories({type:storiesFecthInit});
    try{
      const result = await axios.get(url);
      dispatchStories({
        type:storiesFetchSuccess,
        payload: result.data.hits,
      });}catch{
        dispatchStories({type:storiesFetchFailure});
      }
    },[url]);

  React.useEffect(()=>{
    handleFetchStories();
  },[handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: removeStory,
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  return(
    <div>
      <h1>My Hacker Stories</h1>
      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit}/>
      <hr />
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading?(
        <p>Loading...</p>
      ):(<List list={stories.data} onRemoveItem={handleRemoveStory}/>)}
    </div>
  ); 
}; 

const SearchForm = ({searchTerm,onSearchInput,onSearchSubmit,}) => {
  return(
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={onSearchInput}>
        <strong>Search:</strong>
      </InputWithLabel>
      <button type="submit" disabled={!searchTerm}>
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
      <label htmlFor={id}>{children}</label>&nbsp;
      <input ref={inputRef} id={id} type={type} value={value} onBlur={handleBlur} onChange={onInputChange} />
    </>
  );
};

const List = ({list, onRemoveItem}) => {
  return(
    <ul>
      {list.map((item) => (
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        ))}
    </ul>
  );
};

const Item = ({item, onRemoveItem}) => {
  return (
    <li>
        <span>
        <a href={item.url}>{item.title}</a>
        </span> <br />
        Author: <span>{item.author}</span> <br />
        Number of comments: <span>{item.num_comments}</span> <br />
        Points: <span>{item.points}</span> <br />
        <span><button type="button" onClick={() => onRemoveItem(item)}>Dismiss</button></span>
    </li>
  );
};

SearchForm.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchInput: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
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
  onRemoveItem: PropTypes.func,
};

export default App;
export {storiesReducer,SearchForm,InputWithLabel,List,Item};
