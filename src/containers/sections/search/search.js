import React from 'react';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng
} from "use-places-autocomplete";
    
import {
Combobox,
ComboboxInput,
ComboboxPopover,
ComboboxList,
ComboboxOption,
} from "@reach/combobox";
  
import "@reach/combobox/styles.css";
import classes from "./search.module.scss" 
    

export default function Search({ ...props}) {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        location: { lat: () => 29.7604, lng: () => -95.3698 },
        radius: 100 * 1000
      }, 
    });
  
    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest
  
    const handleInput = (e) => {
      setValue(e.target.value);

    };
  
    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();
  
      try {
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);

        props.panTo({ lat, lng }, address);
    
      } catch (error) {
        console.log("Error: ", error);
      }
       
    };
  
    return (
      
      <div className={classes.search}>
        <Combobox onSelect={handleSelect}>
          <ComboboxInput
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Search your location"
          />
          <ComboboxPopover className={classes.resultsbox} >
            <ComboboxList>
              {status === "OK" &&
                data.map(({ id, description }) => (
                  <ComboboxOption key={id} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
      </div>
    );
  }