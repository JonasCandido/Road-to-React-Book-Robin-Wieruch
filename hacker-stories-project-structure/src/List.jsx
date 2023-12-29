import PropTypes from 'prop-types';

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

List.propTypes = {
  list: PropTypes.array.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

Item.propTypes = {
  item: PropTypes.object.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

export {List};
