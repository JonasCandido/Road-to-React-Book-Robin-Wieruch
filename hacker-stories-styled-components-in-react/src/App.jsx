import * as React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const removeStory = 'REMOVE_STORY';
const storiesFecthInit = 'STORIES_FETCH_INIT';
const storiesFetchSuccess = 'STORIES_FETCH_SUCCESS';
const storiesFetchFailure = 'STORIES_FETCH_FAILURE';

const StyledContainer = styled.div`
  height:100vw;
  padding: 20px;
  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;`;

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;`;

const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  a{
    color: inherit;
  }
  width: ${(props) => props.width};
`;

const StyledButton = styled.button`
 background: transparent;
 border: 1px solid #171212;
 padding: 5px;
 cursor: pointer;
 transition: all 0.1s ease-in;
 &:hover{
  background: #171212;
  color: #ffffff;
 }
`;

const StyledButtonSmall = styled(StyledButton)`
 padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
 padding: 10px;
`;

const StyledSearchForm = styled.form`
 padding: 10px 0 20px 0;
 display: flex;
 algin-items: baseline;
`;

const StyledLabel = styled.label`
 border-top: 1px solid #171212;
 border-left: 1px solid #171212;
 padding-left: 5px;
 font-size: 24px;
`;

const StyledInput = styled.input`
 border: none;
 border-bottom: 1px solid #171212;
 background-color: transparent;
 font-size: 24px;
`;

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
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>
      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit}/>
      <hr />
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading?(
        <p>Loading...</p>
      ):(<List list={stories.data} onRemoveItem={handleRemoveStory}/>)}
    </StyledContainer>
  ); 
}; 

const SearchForm = ({searchTerm,onSearchInput,onSearchSubmit,}) => {
  return(
    <StyledSearchForm onSubmit={onSearchSubmit}>
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={onSearchInput}>
        <strong>Search:</strong>
      </InputWithLabel>
      <StyledButtonLarge type="submit" disabled={!searchTerm}>
        Submit
      </StyledButtonLarge>
    </StyledSearchForm>
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
      <StyledLabel htmlFor={id}>{children}</StyledLabel>&nbsp;
      <StyledInput ref={inputRef} id={id} type={type} value={value} onBlur={handleBlur} onChange={onInputChange} />
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
    <StyledItem>
        <StyledColumn width="40%">
        <a href={item.url}>{item.title}</a>
        </StyledColumn>
        <StyledColumn width="30%">{item.author}</StyledColumn>
        <StyledColumn width="10%">{item.num_comments}</StyledColumn>
        <StyledColumn width="10%">{item.points}</StyledColumn>
        <StyledColumn width="10%"><StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>Dismiss</StyledButtonSmall></StyledColumn>
    </StyledItem>
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
  onRemoveItem: PropTypes.func.isRequired,
};

export default App;
