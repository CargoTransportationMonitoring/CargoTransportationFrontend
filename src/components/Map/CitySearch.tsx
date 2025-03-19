import React, {JSX, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import styles from "./CitySearch.module.css";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setError} from "../../redux/slices/InfoTabSlice";

interface CitySearchProps {
    handleCitySelectForMap: (city: any) => void;
}


const CitySearch: React.FC<CitySearchProps> = ({handleCitySelectForMap}: CitySearchProps): JSX.Element => {

    const [cityQuery, setCityQuery] = useState<string>("");
    const [cityResults, setCityResults] = useState<any[]>([]);
    const [debouncedCityQuery, setDebouncedCityQuery] = useState<string>(cityQuery);
    const [selectedCity, setSelectedCity] = useState<any | null>(null);
    const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const dispatch: Dispatch = useDispatch();

    // API для поиска города
    const fetchCities = async (query: string): Promise<void> => {
        if (query.trim() === "") {
            setCityResults([]);
            return;
        }

        try {
            const response: AxiosResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: query,
                    format: "json",
                    addressdetails: 1,
                    limit: 5,
                },
            });
            setCityResults(response.data);
        } catch (error) {
            dispatch(setError(`Error fetching cities: ${error}`));
        }
    };

    const handleCitySelect = (city: any): void => {
        setSelectedCity(city);
        setCityQuery(city.display_name);
        setDropdownVisible(false);
        handleCitySelectForMap(city);
    }

    const handleBlur = (): void => {
        // Задержка для обработки клика на элементе списка
        setTimeout(() => setDropdownVisible(false), 200);
    };

    useEffect((): void => {
        fetchCities(cityQuery).then();
    }, [debouncedCityQuery]);

    useEffect(() => {
        const timer: NodeJS.Timeout = setTimeout((): void => {
            setDebouncedCityQuery(cityQuery);
        }, 1000)

        return () => clearTimeout(timer)
    }, [cityQuery]);

    return (
        <div className={styles.citySearchContainer}>
            <input
                type="text"
                value={cityQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCityQuery(e.target.value)
                }
                placeholder="Поиск локации"
                onFocus={() => setDropdownVisible(true)}
                onBlur={handleBlur}
            />
            {isDropdownVisible && cityResults.length > 0 && (
                <ul className={styles.cityDropdown}>
                    {cityResults.map((city) => (
                        <li
                            key={city.place_id}
                            onClick={() => handleCitySelect(city)}
                            className={styles.cityDropdownItem}
                        >
                            {city.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CitySearch