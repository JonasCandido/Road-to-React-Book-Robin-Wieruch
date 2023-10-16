import React from 'react';
import PropTypes from 'prop-types';

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

  const [searchTerm, setSearchTerm] = React.useState('React');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return(
    <div>
      <h1>My Hacker Stories</h1>
      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />
      <List list={searchedStories} />
    </div>
  );
}; 

const Search = ({search, onSearch}) => {
  const handleBlur = (event) => {
    console.log(event.target.value);
  };

  return(
    <div>
      <label htmlFor="search">Search:</label>
      <input id="search" type="text" value={search} onBlur={handleBlur} onChange={onSearch} />
    </div>
  );
};

const List = ({list}) => {
  return(
    <ul>
      {list.map((objectID, ...item) => (
          <Item key={objectID} {...item} />
        ))}
    </ul>
  );
};

const Item = ({title,url,author,num_comments,points}) => {
  return (
    <li>
        <span>
        <a href={url}>{title}</a>
        </span> <br />
        Author: <span>{author}</span> <br />
        Number of comments: <span>{num_comments}</span> <br />
        Points: <span>{points}</span>
    </li>
  );
};

Search.propTypes = {
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

List.propTypes = {
  list: PropTypes.array.isRequired,
};

Item.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  num_comments: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
};

export default App;
