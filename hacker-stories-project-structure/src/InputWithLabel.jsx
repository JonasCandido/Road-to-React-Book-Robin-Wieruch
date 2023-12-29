import * as React from 'react';
import PropTypes from 'prop-types';

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
        <label htmlFor={id}>{children}</label>&nbsp;
        <input ref={inputRef} id={id} type={type} value={value} onBlur={handleBlur} onChange={onInputChange} />
      </>
    );
};

InputWithLabel.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    isFocused: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export {InputWithLabel};
