import React from 'react';
import classes from './App.module.scss';
import Map from './Components/map/map';

function App() {
  return (
    <div className={classes.App}>
    	<Map />
    	<div className={classes.footer}>
	        <div className={classes.follow}> 
	            <p>Follow Me  <span><a href="https://www.truefiremedia.com/">Portfolio  </a></span><span><a href="https://www.instagram.com/truefiremedia">Instagram   </a></span><span><a href="https://www.linkedin.com/in/juan-estrada-57531b101/">LinkedIn </a></span></p>
	        </div>
	        <div className={classes.poweredby}>
	            <p>Powered by  </p><img src="/google.png" alt="google" />
	        </div>
	    </div>
    </div>
  );
}

export default App;
