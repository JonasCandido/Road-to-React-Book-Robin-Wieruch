import PropTypes from 'prop-types';
import {InputWithLabel} from './InputWithLabel';

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

SearchForm.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchInput: PropTypes.func.isRequired,
    onSearchSubmit: PropTypes.func.isRequired,
};

export {SearchForm};
