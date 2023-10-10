const list = [{
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
]

const App = () => {
  return(
    <div>
      <h1>My Hacker Stories</h1>
      <Search />
      <hr />
      <List />
      <List />
      <List />
    </div>
)};

const Search = () => {
  const handleChange = (event) => {
    console.log(event);
    console.log(event.target.value)
  };

  const handleBlur = (event) => {
    console.log(event);
    console.log(event.target.value)
  }

  return(
    <div>
      <label htmlFor="search">Search:</label>
      <input id="search" type="text" onChange={handleChange} onBlur={handleBlur} />
    </div>
  );
};

const List = () => {
  return(
    <ul>
      {list.map((item) => 
        (
          <li key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span> <br />
            Author: <span>{item.author}</span> <br />
            Number of comments: <span>{item.num_comments}</span> <br />
            Points: <span>{item.points}</span>
          </li>
        ))}
    </ul>
)};

export default App;
