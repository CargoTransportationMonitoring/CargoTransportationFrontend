import React, {JSX, useEffect, useRef, useState} from "react";
import leaflet from "leaflet";
import {Geolocation} from "../../hooks/useGeolocation";
import CitySearch from "./CitySearch";
import axios, {AxiosResponse} from "axios";
import {API_V1_ROUTE_PREFIX, SERVER_ROUTE_URI} from "../../util/Constants";
import {getToken} from "../auth/KeycloakService";

const MapComponent: React.FC<{
    markersArray: Array<Geolocation>
    routeId: string | null
}> = ({markersArray, routeId}): JSX.Element => {
    const mapRef: any = useRef();

    const [nearbyMarkers, setNearbyMarkers] = useState<Geolocation[]>([]);
    const markersMap: Map<string, leaflet.Marker> = new Map<string, leaflet.Marker>()

    const addMarker = (latitude: number, longitude: number): void => {
        const pointKey: string = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

        if (!markersMap.has(pointKey)) {
            const marker: leaflet.Marker = leaflet
                .marker([latitude, longitude])
                .addTo(mapRef.current)
                .bindPopup(
                    `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
                );

            marker.on("click", (): void => {
                marker.remove();
                markersMap.delete(pointKey);
                setNearbyMarkers((prevMarkers: Geolocation[]) =>
                    prevMarkers.filter(
                        (m: Geolocation) =>
                            m.latitude.toFixed(6) !== latitude.toFixed(6) ||
                            m.longitude.toFixed(6) !== longitude.toFixed(6)
                    )
                );
            });

            const [lat, long] = pointKey.split(',')
            markersArray.push({latitude: Number(lat), longitude: Number(long)})
            markersMap.set(pointKey, marker);
        }
    }

    useEffect(() => {
        if (routeId) {
            axios.get(`${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}/${routeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }).then((response: AxiosResponse): void => {
                const {coordinates} = response.data;
                coordinates.forEach(({latitude, longitude}: Geolocation): void => {
                    addMarker(latitude, longitude);
                });
            }).catch((error): void => {
                console.log(error)
            })
        }
        mapRef.current = leaflet
            .map("map")
            .setView([0, 0], 1);

        leaflet
            .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            })
            .addTo(mapRef.current);

        nearbyMarkers.forEach(({latitude, longitude}: Geolocation): void => {
            addMarker(latitude, longitude);
        });

        mapRef.current.on("click", (e: leaflet.LeafletMouseEvent): void => {
            addMarker(e.latlng.lat, e.latlng.lng);
        });

        return (): void => {
            mapRef.current?.remove();
            markersMap.clear();
        };
    }, []);

    return (
        <>
            <CitySearch handleCitySelectForMap={(city: any): void => {
                addMarker(Number(city.lat), Number(city.lon));
            }}/>
            <div id="map" ref={mapRef}></div>
        </>
    )
}

export default MapComponent;