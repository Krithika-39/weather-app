import { useState } from "react";
import Axios from "axios";

const Weather = () => {
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [showDiv, setShowDiv] = useState(false);
    const [loading, setLoading] = useState(false);

    const [weather, setWeather] = useState("");
    const [temp, setTemp] = useState("");
    const [desc, setDesc] = useState("");
    const [humidity, setHumidity] = useState("");
    const [pressure, setPressure] = useState("");
    // const [timezone, setTimezone] = useState("");
    const [windSpeed, setWindSpeed] = useState("");
    const [highTemp, setHighTemp] = useState("");
    const [lowTemp, setLowTemp] = useState("");
    const [sunrise, setSunrise] = useState("");
    const [sunset, setSunset] = useState("");
    const [icon, setIcon] = useState("");

    const handleCity = (event) => {
        setCity(event.target.value);
    }

    const toCelsius = (k) => {
        return (k - 273.15).toFixed(1);
    }

    // Convert to Indian Standard Time
    const formatIST = (unix) => {
        const date = new Date(unix * 1000);
        return date.toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getCity = () => {
        if (city.trim() === "") {
            setError("Enter a valid city,Dont pass empty string!");
            setShowDiv(false);
            return;
        }

        setLoading(true);

        let weatherdata = Axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=69f5a6f5fbe954deefc79e1cc53bdda8`)


        weatherdata.then((success) => {
            setError("");
            setShowDiv(true);

            setWeather(success.data.weather[0].main);
            setTemp(toCelsius(success.data.main.temp));
            setDesc(success.data.weather[0].description);
            setHumidity(success.data.main.humidity);
            setPressure(success.data.main.pressure);
            setHighTemp(toCelsius(success.data.main.temp_max));
            setLowTemp(toCelsius(success.data.main.temp_min));
            setWindSpeed(success.data.wind.speed);

            // IST sunrise and sunset
            setSunrise(formatIST(success.data.sys.sunrise));
            setSunset(formatIST(success.data.sys.sunset));

            setIcon(success.data.weather[0].icon);
            setLoading(false);
            //setCity("");
        
        })
            .catch(() => {
                setError("City not found. Please enter a correct city!");
                setShowDiv(false);

            })
        


    };

    return (
        <>
            <div className="min-h-screen bg-animated flex justify-center items-center p-6 fade-page">
                <div className="bg-white p-10 rounded-xl w-full max-w-lg shadow-xl card-animate">

                    <h1 className="text-red-700 text-3xl font-bold text-center">WEATHER APP</h1>

                    <input
                        type="text"
                        value={city}
                        className="mt-3 p-2 border border-black rounded-md w-full outline-cyan-800"
                        placeholder="Enter your city"
                        onChange={handleCity}
                    />

                    <button
                        className="bg-red-950 mt-3 text-white p-2 rounded-md w-full btn-animate"
                        onClick={getCity}
                    >
                        Get Report
                    </button>

                    {loading && <div className="skeleton-box mt-5"></div>}

                    {error && <p className="text-red-600 mt-3">{error}</p>}

                    <div className={`fade-slide ${showDiv ? "show" : ""}`}>
                        {showDiv && (
                            <div className="mt-5 bg-gray-100 p-5 rounded-xl shadow-md">

                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold capitalize">{city}</h2>
                                    <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="" />
                                </div>

                                <p className="text-gray-600 capitalize">{desc}</p>
                                <h1 className="text-4xl font-bold mt-2">{temp}°C</h1>
                                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">

                                    <div className="p-3 bg-[#FFFFFF99] rounded-lg shadow flex justify-between items-center">
                                        <span className="font-semibold">Humidity</span>
                                        <span>{humidity}%</span>
                                    </div>

                                    <div className="p-3 bg-[#FFFFFF99] rounded-lg shadow flex justify-between items-center">
                                        <span className="font-semibold">Pressure</span>
                                        <span>{pressure}</span>
                                    </div>

                                    <div className="p-3 bg-[#FFFFFF99] rounded-lg shadow flex justify-between items-center">
                                        <span className="font-semibold">Wind</span>
                                        <span>{windSpeed} m/s</span>
                                    </div>

                                    <div className="p-3 bg-[#FFFFFF99] rounded-lg shadow flex justify-between items-center">
                                        <span className="font-semibold">High Temp</span>
                                        <span>{highTemp}°C</span>
                                    </div>

                                    <div className="p-3 bg-[#FFFFFF99] rounded-lg shadow flex justify-between items-center">
                                        <span className="font-semibold">Low Temp</span>
                                        <span>{lowTemp}°C</span>
                                    </div>

                                    <div className="p-3 bg-[#FFFFFF99] rounded-lg shadow flex justify-between items-center">
                                        <span className="font-semibold">Sunrise</span>
                                        <span>{sunrise}</span>
                                    </div>

                                    <div className="p-3 bg-[#FFFFFF99] rounded-lg shadow flex justify-between items-center">
                                        <span className="font-semibold">Sunset</span>
                                        <span>{sunset}</span>
                                    </div>

                                </div>


                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ANIMATIONS + SKELETON */}
            <style>{`
        .bg-animated {
          background: linear-gradient(135deg, #141e30, #243b55);
          background-size: 300% 300%;
          animation: gradientMove 10s infinite ease-in-out;
        }

        @keyframes gradientMove {
          0% { 
          background-position: 0% 50%;
           }
          50% { 
          background-position: 100% 50%; 
          }
          100% { 
          background-position: 0% 50%; 
          }
        }

        .fade-page {
          animation: fadePage 0.8s ease;
        }

        @keyframes fadePage {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .fade-slide {
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.5s ease;
        }
        .fade-slide.show {
          opacity: 1;
          transform: translateY(0);
        }

        .btn-animate:hover {
          transform: translateY(-3px);
          transition: 0.3s;
        }

        .card-animate:hover {
          transform: scale(1.03);
          transition: 0.3s;
        }

        .skeleton-box {
          height: 150px;
          border-radius: 10px;
          background: linear-gradient(90deg, #ccc, #e0e0e0, #ccc);
          animation: skeleton 1.5s infinite;
        }

        @keyframes skeleton {
          0% { 
          background-position: -200px 0; 
          }
          100% { 
          background-position: 200px 0; 
          }
        }
      `}
      </style>
        </>
    );
};

export default Weather;