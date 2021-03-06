import React from "react";
import AsyncSelect from 'react-select/async';
import { searchUsers } from '../../utils/api.js';

export function RecipientInput(props) {
  const promiseOptions = async inputValue => {
    return await searchUsers(inputValue).then((res, err) => {
      const loadedOptions = res.data.map((user) => ({
        value: user.user_id,
        label: user.username
      }));
      return loadedOptions
    });
  }
  
  const handleChange = (selection) => {
    props.setRecipient(selection.label);
  }

  return (
    <AsyncSelect
      className="shadow rounded mx-4"
      onChange={handleChange}
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      placeholder='Search for a user...'
      isSearchable
      noOptionsMessage={() => (`Tip: search for 'eyeino' and send him a message!`)}
      theme={theme => ({
        ...theme,
        borderRadius: "0.25rem",
        colors: {
          ...theme.colors,
          primary25: "pink",
          primary: "#f56565"
        }
      })}
    />
  );
}