import React from 'react';
import classes from './news.module.scss';

const newsSection = (props) => {
   
    let attachedClasses = [classes.News_section, classes.Close];
    if (props.open) {
        attachedClasses = [classes.News_section, classes.Open];
    }
    return (
    <div className={attachedClasses.join(' ')} >
        <div className={classes.window}></div>
        <div className={classes.articles}>   
           
            <div className={classes.header}><h4>Covid-19 Related News for {props.city}, {props.st}</h4></div>
            {props.art.map(art => (
                <div className={classes.articlecontainer} key={art.guid} >
                    <div className={classes.article_title}><p><a href={art.link} >{art.title}</a><span>{art.pubDate}</span></p></div>
                    <div className={classes.article_marker}><img src="/news.png" alt="covid-news"/></div>    
                </div> 
            ))}
            <div className={classes.disclaimer}>
                <h5>About this data</h5>
                <br />
                <h6>It changes rapidly</h6>
                <p>This data changes rapidly and might not reflect some cases still being reported.</p>
                <br />
                <h6>It only includes people tested</h6>
                <p>Cases only include people who were tested and confirmed positive. Testing rulse and availability vary by country. Some areas may not have data because they haven't published their data or haven't done so recently.</p>
                <br />
                <h6>Why do I see different data from different sources?</h6>
                <p>There are various sources that are tracking and aggregating coronavirus data. They update at different times and may have different ways of gathering data.</p>
                <p className={classes.sources}><strong>Sources:  </strong><a href="https://github.com/CSSEGISandData/COVID-19">JHU CSSE COVID-19 Data</a></p>
            </div>
            <div className={classes.end}><a href="https://www.truefiremedia.com">@TrueFireMedia</a></div>
            </div>      
    </div>
)
};

export default newsSection;