import React from 'react';
import classes from './locate.module.scss';

export default function Locate({ panTo }) {
    return (
      <button
        className={classes.locate}
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => null
          );
        }}
      >
        <img src="/location.svg" alt="Use current location" />
      </button>
    );
}