import axios from 'axios';

const instance = axios.create({
    baseURL: "`https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fgl%3DUS%26hl%3Den-US%26num%3D10%26ceid%3DUS%3Aen%26q%3D${newAddress}-covid-19&api_key=vcgcszun0w881wrjor7jdrz2ol23vphp0tomza0n&order_by=pubDate&order_dir=desc&count=20`"
});

export default instance; 