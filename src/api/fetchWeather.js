import axios from 'axios';

const URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'ad05f6a54175ea0f432f984dbec3fa88'

export const fetchWeather = async (query) =>{

  

  const {data} = await axios.get(URL,{
    params: {
      q:query,
      units: 'metric',
      APPID: API_KEY
    }
  });
  
  return data;
}

