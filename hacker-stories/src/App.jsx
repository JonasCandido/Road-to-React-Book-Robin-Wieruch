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

const Search = (props) => {
  const handleBlur = (event) => {
    console.log(event);
    console.log(event.target.value);
  };

  return(
    <div>
      <label htmlFor="search">Search:</label>
      <input id="search" type="text" value={props.search} onBlur={handleBlur} onChange={props.onSearch} />
    </div>
  );
};

const List = (props) => {
  return(
    <ul>
      {props.list.map((item) => (
          <Item key={item.objectID} item={item} />
        ))}
    </ul>
  );
};

const Item = (props) => {
  return (
    <li>
            <span>
            <a href={props.item.url}>{props.item.title}</a>
            </span> <br />
            Author: <span>{props.item.author}</span> <br />
            Number of comments: <span>{props.item.num_comments}</span> <br />
            Points: <span>{props.item.points}</span>
    </li>
  );
}

Search.propTypes = {
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

List.propTypes = {
  list: PropTypes.array.isRequired,
};

Item.propTypes = {
  item: PropTypes.array.isRequired,
};

export default App;
