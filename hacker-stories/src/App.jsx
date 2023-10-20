import React from 'react';
import PropTypes from 'prop-types';

const useStorageState = (key,initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
}; 

const App = () => {
  const stories = [{
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

  const [searchTerm, setSearchTerm] = useStorageState('search','React');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return(
    <>
      <h1>My Hacker Stories</h1>
      <InputWithLabel id="search" label="Search"  value={searchTerm} onInputChange={handleSearch} />
      <hr />
      <List list={searchedStories} />
    </>
  );
}; 

const InputWithLabel = ({id, label, value, type='text',onInputChange}) => {
  const handleBlur = (event) => {
    console.log(event.target.value);
  };

  return(
    <>
      <label htmlFor={id}>{label}</label>&nbsp;
      <input id={id} type={type} value={value} onBlur={handleBlur} onChange={onInputChange} />
    </>
  );
};

const List = ({list}) => {
  return(
    <ul>
      {list.map((item) => (
          <Item key={item.objectID} item={item} />
        ))}
    </ul>
  );
};

const Item = ({item}) => {
  return (
    <li>
        <span>
        <a href={item.url}>{item.title}</a>
        </span> <br />
        Author: <span>{item.author}</span> <br />
        Number of comments: <span>{item.num_comments}</span> <br />
        Points: <span>{item.points}</span>
    </li>
  );
};

InputWithLabel.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

List.propTypes = {
  list: PropTypes.array.isRequired,
};

Item.propTypes = {
  item: PropTypes.array.isRequired,
};

export default App;
