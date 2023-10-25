import React from 'react';
import PropTypes from 'prop-types';

const initialStories = [{
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
},
{
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
},
];

const setStories = 'SET_STORIES';
const removeStory = 'REMOVE_STORY'

const getAsyncStories = () => new Promise((resolve) => 
  setTimeout(() => resolve({data: {stories: initialStories}}),2000));

const storiesReducer = (state,action) => {
  switch(action.type){
    case setStories:
      return action.payload;
    case removeStory:
      return state.filter(
        (story) => action.payload.objectID !== story.objectID
    );
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

  const [stories, dispatchStories] = React.useReducer(storiesReducer,[]);

  const[isLoading, setIsLoading] = React.useState(false);
  
  const[isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    getAsyncStories().then(result => {
      dispatchStories({
        type: setStories,
        payload: result.data.stories,
      });
      setIsLoading(false);
    }).catch(() => setIsError(true));
  },[]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: removeStory,
      payload: item,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return(
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearch}><strong>Search:</strong></InputWithLabel>
      <hr />
      {isError && <p>Something went wrong...</p>}
      {isLoading?(
        <p>Loading...</p>
      ):(<List list={searchedStories} onRemoveItem={handleRemoveStory} />)}
    </div>
  );
}; 

const InputWithLabel = ({id,value, type='text',onInputChange,isFocused,children,}) => {
  const handleBlur = (event) => {
    console.log(event.target.value);
    console.log(inputRef)
  };

  //A
  const inputRef = React.useRef();

  //C
  React.useEffect(() => {
    if(isFocused && inputRef.current){
  //D
      inputRef.current.focus();
    }
  },[isFocused]);

  return(
    <>
      <label htmlFor={id}>{children}</label>&nbsp;
      {/* B */}
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

InputWithLabel.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

List.propTypes = {
  list: PropTypes.array.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

Item.propTypes = {
  item: PropTypes.array.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

export default App;
