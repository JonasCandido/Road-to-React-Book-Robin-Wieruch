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
  // A
  const handleSearch = (event) => {
  // D
    console.log(event.target.value);
  };

  return(
    <div>
      <h1>My Hacker Stories</h1>
      {/* //B */}
      <Search onSearch={handleSearch} />
      <hr />
      <List list={stories} />
    </div>
  );
};

const Search = (props) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  console.log(searchTerm)
  
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    //C
    props.onSearch(event);
  }

  const handleBlur = (event) => {
    console.log(event);
    console.log(event.target.value);
  };

  return(
    <div>
      <label htmlFor="search">Search:</label>
      <input id="search" type="text" onChange={handleChange} onBlur={handleBlur} />
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

List.propTypes = {
  list: PropTypes.array.isRequired,
};

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

Item.propTypes = {
  item: PropTypes.array.isRequired,
};

export default App;
