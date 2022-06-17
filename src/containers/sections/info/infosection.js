import React from 'react';
import classes from './info.module.scss';

const infoSection = (props) => {
    let isloading = <span><small>Loading...</small></span>;
    return (
        <div className={classes.info_section}>
            <h2>{props.data.county}</h2>
            <div className={classes.cases_deaths}><h1>{props.data.loading ? isloading : props.data.deaths }</h1><span>Deaths</span></div>
            <div className={classes.section_divider}></div>
            <div className={classes.cases_other}>
                <div className={classes.cases_confirmed}><h2>{props.data.loading ? isloading : props.data.confirmed }</h2><span>Confirmed</span></div>
                <div className={classes.cases_recovered}><h2>{((props.data.loading ? isloading : props.data.recovered) !== "" ? props.data.loading ? isloading : props.data.recovered : "-") }</h2><span>Recovered</span></div>
            </div>
            <div className={classes.disclaimer}>
                <h4>About this data</h4>
                <br />
                <h5>It changes rapidly</h5>
                <p>This data changes rapidly and might not reflect some cases still being reported.</p>
                <br />
                <h5>It only includes people tested</h5>
                <p>Cases only include people who were tested and confirmed positive. Testing rulse and availability vary by country. Some areas may not have data because they haven't published their data or haven't done so recently.</p>
                <br />
                <h5>Why do I see different data from different sources?</h5>
                <p>There are various sources that are tracking and aggregating coronavirus data. They update at different times and may have different ways of gathering data.</p>
                <p className={classes.sources}><strong>Sources:  </strong><a href="https://github.com/CSSEGISandData/COVID-19">JHU CSSE COVID-19 Data</a></p>
            </div>
        </div> 
)
};

export default infoSection;