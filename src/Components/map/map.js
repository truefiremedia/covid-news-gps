import React from 'react';
import classes from './map.module.scss';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Search from '../../containers/sections/search/search';
import Locate from '../../containers/sections/locate/locate';
import "@reach/combobox/styles.css";
import Newssection from '../../containers/sections/news/newssection';
import Infosection from '../../containers/sections/info/infosection';
import mapStyles from "./mapStyles";

require('dotenv').config();

var min = 0;
var max = 0.050;


let cityState, newAddress;

const options = {
    styles: mapStyles,
    disableDefaultUI: true
  };

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: 29.7604,
    lng: -95.3698,
  };
    
const libraries = ["places"];


class Map extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            latitude: null,
            longitude: null,
            userAddress: " ",
            city: null,
            state: null,
            county: null,
            confirmed: null,
            deaths: null,
            recovered: null,
            articles: [],
            selected: null,
            setSelected: null,
            locallat: null,
            locallng: null,
            loading: false,
            articlesLoading: false,
            gitdata: []
        }

        this.mapRef = React.createRef();
    }

    static defaultProps = {
        center: {
          lat: 29.7604,
          lng: -95.3698
        },
        zoom: 10,
        type: 'terrain'
    }
    
    componentDidMount(){
        //Get Geolocation
        navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                locallat: position.coords.latitude,
                locallng: position.coords.longitude,
              }, () => {
                  if (this.state.latitude !== null){
                        
                        this.reverseGeocodeCoordinates();
                        
                        this.getGithubData();

                        center.lat = position.coords.latitude;
                        center.lng = position.coords.longitude;
                        
                        
                  }else {
                      alert("GeoLocation not available")
                  }
                  
            
            });
            
            
            },
            () => null
            
        );
        
    }

    handleLocationError = (error) => {
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("User has denied the request for Geolocation.")
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.")
                break;
            case error.TIMEOUT:
                alert("The request to retrieve user location timed out.")
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occured.")
                break;     
            default: 
            alert("An unknown error occured.")   
        }
    }
    reverseGeocodeCoordinates = () => {
        const date = localStorage.getItem('lastUpdated');
        const gitDate = date && new Date(parseInt(date));
        const currentDate = new Date();
        
        const dataAge = Math.round((currentDate - gitDate) / (1000 * 60));// in minutes
        const tooOld = dataAge >= 300; 

        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.latitude},${this.state.longitude}&result_type=political&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        .then(response => response.json())
        .then(data => 
            this.setState(() => ({
            userAddress: data.results[0].formatted_address,
            city: data.results[0].address_components[0].long_name,
            state: data.results[0].address_components[2].long_name,
            county: data.results[0].address_components[1].long_name, 
            }), () => {

                this.getNews();
                
                if(tooOld){
        
                    this.getGithubData();
                }else{

                    this.getlocalData();
                }
        }) 
        )
        .catch(error => console.log(error))
    
    }

    //get localstorage data
    getlocalData = () => {

        let localCounty = this.state.county;

        if (localCounty !== null){
            const lcounty = localCounty.split(" ");
            lcounty.pop();
            localCounty = lcounty.join(" ");
        }
        var localArray = JSON.parse(localStorage.getItem('hubData')).filter(function (el) {
            return el.Admin2 === localCounty 
            
        });
        this.setState({
            confirmed: localArray[0].Confirmed,
            deaths: localArray[0].Deaths,
            recovered: localArray[0].Recovered,
            loading: false
        }) 
       
    }
    // Backup Covid API
    // getCases = () => {

    //     fixedaddress = addressp.replace(/,/g, '').split(' ').join('-');

    //     let url = `https://api.covidnow.com/v1/local/finder?address=${newAddress}`;

    //     var req = new Request(url);

    //     fetch(req)
    //         .then(response => response.json())
    //         .then(data => this.setState({
    //             city: data.info.locality,
    //             state: data.info.state,
    //             county: data.info.county,
    //             confirmed: data.cases.county.confirmed,
    //             deaths: data.cases.county.deaths,
    //             recovered: data.cases.county.recovered
    //         }))
    //         .catch(error => alert(error))
    // }
    
    getNews = () => {
        this.FetchDataFromRssFeed();
       // getCases();
    }
    //Get News from Google
    FetchDataFromRssFeed() {
        cityState = this.state.city + "-" + this.state.state;
        newAddress = cityState.replace(/,/g, '').split(' ').join('-');

        // let newsurl = `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3D${newAddress}-covid19%26hl%3Den-US%26gl%3DUS%26ceid%3DUS%3Aen`;
        let newsurl = `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fgl%3DUS%26hl%3Den-US%26num%3D10%26ceid%3DUS%3Aen%26q%3D${newAddress}-covid-19&api_key=vcgcszun0w881wrjor7jdrz2ol23vphp0tomza0n&order_by=pubDate&order_dir=desc&count=20`;

        this.setState({ articlesLoading: true }, () => { 
            axios.get(newsurl)
            .then( response => {
                const currentResponse = response.data.items;
                const updatedResponse = currentResponse.map(article => {
                    return {
                        ...article, 
                        lat: this.state.latitude + Math.random() * (max - min) + min,
                        lng: this.state.longitude + Math.random() * (max - min) + min
                    }
                });
                this.setState({
                    articles: updatedResponse,
                    articlesLoading: false
                });
            })
        }); 
    }
    //Get Covid cases from John Hopkins Github
    getGithubData = () =>{
        let currCounty = this.state.county;
      
        if (currCounty !== null){
            const scounty = currCounty.split(" ");
            scounty.pop();
            currCounty = scounty.join(" ");
        }
        
        this.setState({ loading: true, setSelected: null, gitdata: [] }, () => { 
            fetch('https://coronavirus.m.pipedream.net')
            .then(response => response.json())
            .then(data => {    

                var newArray = data.rawData.filter(function (el) {
                    return el.Admin2 === currCounty
                    
                });

                this.setState({
                    confirmed: newArray[0].Confirmed,
                    deaths: newArray[0].Deaths,
                    recovered: newArray[0].Recovered,
                    loading: false,
                    gitdata: data.rawData
                }) 

                //save gitHub data to localstorage
                localStorage.setItem("hubData", JSON.stringify(this.state.gitdata));
                //save gitHub date to localstorage
                localStorage.setItem("lastUpdated", Date.now());
            })
            .catch(error => console.log(error))
            
        });    
        
    }  

    onMapLoad = (map) => {
        this.mapRef.current = map;
    }
    //Pan to location on map
    panTo = ({lat, lng}, address) => {
        this.mapRef.current.panTo({lat, lng});
        this.mapRef.current.setZoom(12);
     
        this.setState(() => ({
            latitude: lat,
            longitude: lng
          }), () => {
            if (this.state.latitude !== null){
                this.reverseGeocodeCoordinates();
            }else {
                console.log("There was an issue getting new coordinates")
            }   
        });    
     
    }
    setMarker = (article) => {
        this.setState(() => ({
            setSelected: article
        }))
    }

    render(){

        const articles = this.state.articles;
        let loadingArticles = <img className={classes.loader} src="/loader.svg" alt="loader"/>;
        return (
            <div className={classes.map} >
                <div className={classes.banner}><img src="/covid-icon.png" alt="logo" /><h3>Covid News GPS</h3></div>
                <Infosection data={this.state}/>
                <Newssection art={this.state.articles} open={this.state.showmenu} city={this.state.city} st={this.state.state} panTo={this.panTo} {...this.state}/>
                <Locate panTo={this.panTo}/>
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
                    <GoogleMap 
                        mapContainerStyle={containerStyle}
                        class={classes.gmap}
                        center={center}
                        zoom={12}
                        mapTypeId={this.props.type}
                        options={options}
                        onLoad={this.onMapLoad}
                    >
                        <Search panTo={this.panTo} {...this.state}/>
                        {this.state.articlesLoading ? loadingArticles :  articles.map(article => (
                            <Marker 
                                key={article.guid} 
                                position={{ lat: article.lat, lng: article.lng}}
                                onClick={() => {
                                    this.setMarker(article);
                                }}
                                icon={{
                                    url:"/redcircle2.png",
                                    origin: new window.google.maps.Point(0, 0),
                                    anchor: new window.google.maps.Point(15, 15),
                                    scaledSize: new window.google.maps.Size(40, 40),

                                }}
                            />
                        ))}
                        
                        {this.state.setSelected ? (
                            <InfoWindow 
                                position={{ lat: this.state.setSelected.lat, lng: this.state.setSelected.lng }} 
                                onCloseClick={() => {
                                    this.setMarker(null);
                                }} >
                                <div className={classes.infowindowtitle}>
                                    <p>{this.state.setSelected.title}</p>
                                </div>
                            </InfoWindow>
                        ) : null}
                    </GoogleMap >
                </LoadScript>
            </div>
        )
    }
}

export default Map;