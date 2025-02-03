import WeatherContext from "./WeatherContext.jsx";
import {useState, useEffect} from "react";
import {
    saveCurrentLocation,
    getSavedLocations,
    getSelectedLocation,
    saveSelectedLocation,
    saveSavedLocations
} from "../js/localStorage/localStorageFuncs.js"
import {getGeolocationWeather, getGeolocationWeatherWithCityName} from "../js/api/geolocationApi.js";
import extractInfo from "../js/extractInfo.js";

const WeatherContextProvider = ({ children }) => {
    const [currentCityInfo, setCurrentCityInfo] = useState(null);
    const [savedLocations, setSavedLocations] = useState([]);
    const [selectedLocationInfo, setSelectedLocationInfo] = useState(null);

    useEffect(() => {

        const getCurrentLocationInfo = async (returnCurrentLocationWeather) => {
            navigator.geolocation.getCurrentPosition(async function(position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                // const responseData = await getGeolocationWeather(latitude, longitude);
                // returnCurrentLocationWeather(extractInfo(responseData));

                returnCurrentLocationWeather({
                    "city": "Moscow",
                    "temperature": 3,
                    "description": "overcast clouds",
                    "icon": "04n",
                    "feelTemperature": -2,
                    "humidity": 72,
                    "sunset": "16:31",
                    "windSpeed": 6.81,
                    "pressure": 1011,
                    "sunrise": "08:43"
                });

            }, async function(error) {
                console.error('Ошибка получения геолокации', error);
                // const responseData = await getGeolocationWeather(55.75149845182549, 37.617655078129104);
                // returnCurrentLocationWeather(extractInfo(responseData));

                returnCurrentLocationWeather({
                    "city": "Moscow",
                    "temperature": 3,
                    "description": "overcast clouds",
                    "icon": "04n",
                    "feelTemperature": -2,
                    "humidity": 72,
                    "sunset": "16:31",
                    "windSpeed": 6.81,
                    "pressure": 1011,
                    "sunrise": "08:43"
                });
            });
        }

        const loadSelectedLocation = async () => {
            try {
                const selectedLocation = await getSelectedLocation();
                if(selectedLocation) {
                    const selectedLocationInfoResponse = extractInfo(await getGeolocationWeatherWithCityName(selectedLocation));
                    setSelectedLocationInfo(selectedLocationInfoResponse);
                    await saveSelectedLocation(selectedLocationInfoResponse.city);
                    await getCurrentLocationInfo(async (CurrentLocationWeather) => {
                        setCurrentCityInfo(CurrentLocationWeather);
                        await saveCurrentLocation(CurrentLocationWeather.city);
                    });
                }
                else {
                    await getCurrentLocationInfo(async (CurrentLocationWeather) => {
                        setCurrentCityInfo(CurrentLocationWeather);
                        setSelectedLocationInfo(CurrentLocationWeather);
                        await saveCurrentLocation(CurrentLocationWeather.city);
                        await saveSelectedLocation(CurrentLocationWeather.city);
                    });
                }
            } catch (error) {
                console.error('Ошибка получения информации по выбранному городу:', error);
            }
        };

        loadSelectedLocation();

    }, []);

    useEffect(() => {

        const loadSavedLocations = async () => {
            try {
                const savedLocations = await getSavedLocations();
                setSavedLocations(savedLocations);
            } catch (error) {
                console.error('Ошибка получения сохраненных городов:', error);
            }
        };

        loadSavedLocations();
    }, [])

    const changeSelectedLocation = async (newSelectedLocation) => {
        const selectedLocationInfoResponse = extractInfo(await getGeolocationWeatherWithCityName(newSelectedLocation));
        setSelectedLocationInfo(selectedLocationInfoResponse);
        await saveSelectedLocation(selectedLocationInfoResponse.city);
    }

    // useEffect(() => {
    //     const loadSavedLocations = async () => {
    //         const locations = await getSavedLocations();
    //         setSavedLocations(locations);
    //     }
    //
    //     loadSavedLocations();
    // }, []);
    //
    // useEffect(() => {
    //     const loadSavedLocations = async () => {
    //         await saveSavedLocations(savedLocations);
    //     }
    //     loadSavedLocations();
    // }, [savedLocations]);
    //
    // const addSavedLocation = async (newSavedLocation) => {
    //     setSavedLocations(prevState => [...prevState, newSavedLocation]);
    // };
    //
    // const deleteSavedLocation = async (deleteLocation) => {
    //     setSavedLocations(prevState => prevState.filter((location) => location !== deleteLocation));
    // };

    const addSavedLocation = async (newSavedLocation) => {
        console.log(savedLocations)
        if (savedLocations){
            setSavedLocations(prevState => [...prevState, newSavedLocation]);
            await saveSavedLocations(savedLocations);
        }
        else{
            setSavedLocations(newSavedLocation);
            await saveSavedLocations(newSavedLocation);
        }
    }

    const deleteSavedLocation = async (deleteLocation) => {
        setSavedLocations(prevState => prevState.filter((location) => location !== deleteLocation));
        await saveSavedLocations(savedLocations);
    }

    return (
        <WeatherContext.Provider value={{
            currentCityInfo,
            setCurrentCityInfo,
            savedLocations,
            selectedLocationInfo,
            changeSelectedLocation,
            deleteSavedLocation,
            addSavedLocation,
        }}>
            {children}
        </WeatherContext.Provider>
    )
}

export default WeatherContextProvider;

// const getCurrentLocationInfo = async () => {
//     navigator.geolocation.getCurrentPosition(async function() {
//         return {
//             "city": "Moscow",
//             "temperature": 3,
//             "description": "overcast clouds",
//             "icon": "04n",
//             "feelTemperature": -2,
//             "humidity": 72,
//             "sunset": "16:31",
//             "windSpeed": 6.81,
//             "pressure": 1011,
//             "sunrise": "08:43"
//         }
//     }, async function(error) {
//         console.error('Ошибка получения геолокации', error);
//         return  {
//             "city": "Moscow",
//             "temperature": 3,
//             "description": "overcast clouds",
//             "icon": "04n",
//             "feelTemperature": -2,
//             "humidity": 72,
//             "sunset": "16:31",
//             "windSpeed": 6.81,
//             "pressure": 1011,
//             "sunrise": "08:43"
//         }
//     });
// }

// const getCurrentLocationInfo = async () => {
//     navigator.geolocation.getCurrentPosition(async function(position) {
//         // let latitude = position.coords.latitude;
//         // let longitude = position.coords.longitude;
//         // const responseData = await getGeolocationWeather(latitude, longitude);
//         // return extractInfo(responseData);
//
//         return {
//             "city": "Moscow",
//             "temperature": 3,
//             "description": "overcast clouds",
//             "icon": "04n",
//             "feelTemperature": -2,
//             "humidity": 72,
//             "sunset": "16:31",
//             "windSpeed": 6.81,
//             "pressure": 1011,
//             "sunrise": "08:43"
//         }
//
//         // const getWeatherData = async () => {
//
//
//         //
//         // console.log(info);
//         // await saveCurrentLocation(info.city)
//         // setCurrentCityInfo(info);
//         // }
//         //
//         // getWeatherData();
//     }, async function(error) {
//         console.error('Ошибка получения геолокации', error);
//         // const responseData = await getGeolocationWeather(55.75149845182549, 37.617655078129104);
//         // return extractInfo(responseData);
//         return  {
//             "city": "Moscow",
//             "temperature": 3,
//             "description": "overcast clouds",
//             "icon": "04n",
//             "feelTemperature": -2,
//             "humidity": 72,
//             "sunset": "16:31",
//             "windSpeed": 6.81,
//             "pressure": 1011,
//             "sunrise": "08:43"
//         }
//         // const getWeatherData = async () => {
//
//
//         // console.log(info);
//         // await saveCurrentLocation(info.city)
//         // setCurrentCityInfo(info);
//     });
//     //
//     //     getWeatherData();
//     // });
// }