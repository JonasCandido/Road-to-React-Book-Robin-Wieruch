import React from 'react';
import axios from 'axios';
import {SearchForm} from './SearchForm';
import {List} from './List';

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

export default App;
