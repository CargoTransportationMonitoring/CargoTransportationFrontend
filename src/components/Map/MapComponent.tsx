import React, {JSX, useEffect, useRef, useState} from "react";
import leaflet from "leaflet";
import {Geolocation} from "../../hooks/useGeolocation";
import CitySearch from "./CitySearch";
import axios, {AxiosResponse} from "axios";
import {API_V1_ROUTE_PREFIX, SERVER_ROUTE_URI} from "../../util/Constants";
import {getToken} from "../auth/KeycloakService";
import "../../App.css";
import {isAdmin} from "../../util/KeycloakUtils";

const MapComponent: React.FC<{
    markersArray: Array<Geolocation>
    routeId: string | null
}> = ({markersArray, routeId}): JSX.Element => {
    const mapRef: any = useRef();

    const [nearbyMarkers, setNearbyMarkers] = useState<Geolocation[]>([]);
    const markersMap: Map<string, leaflet.Marker> = new Map<string, leaflet.Marker>()

    const updateMarkersText = (): void => {
        markersArray.forEach((markerData: Geolocation, index: number): void => {
            const pointKey: string = `${markerData.latitude.toFixed(6)},${markerData.longitude.toFixed(6)}`;
            const marker: leaflet.Marker | undefined = markersMap.get(pointKey);
            if (marker) {
                const visitedClass: "visited" | "not-visited" = markerData.isVisited ? "visited" : "not-visited"; // Определяем цвет фона
                const customIcon: leaflet.DivIcon = leaflet.divIcon({
                    className: `custom-marker ${visitedClass}`,
                    html: `<div class="marker-content">${index + 1}</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                });
                marker.setIcon(customIcon);
            }
        });
    };


    const addMarker = (latitude: number, longitude: number, index?: number, isVisited: boolean = false): void => {
        const pointKey: string = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

        if (!markersMap.has(pointKey)) {
            const markerIndex: number = index !== undefined ? index + 1 : markersArray.length + 1;

            const customIcon: leaflet.DivIcon = leaflet.divIcon({
                className: "custom-marker",
                html: `<div class="marker-content">${markerIndex}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            });

            const marker: leaflet.Marker = leaflet
                .marker([latitude, longitude], {icon: customIcon})
                .addTo(mapRef.current);

            isAdmin() ? marker.on("click", (): void => {
                marker.remove();
                markersMap.delete(pointKey);
                const updatedMarkers: Geolocation[] = markersArray.filter(
                    (m: Geolocation) =>
                        m.latitude.toFixed(6) !== latitude.toFixed(6) ||
                        m.longitude.toFixed(6) !== longitude.toFixed(6)
                );
                markersArray.splice(0, markersArray.length, ...updatedMarkers); // Обновляем массив
                updateMarkersText();
            }) : marker.on("click", (): void => {
                console.log('user clicked on marker')
            })

            const [lat, long] = pointKey.split(",");
            markersArray.push({latitude: Number(lat), longitude: Number(long), isVisited: isVisited});
            markersMap.set(pointKey, marker);
            updateMarkersText();
        }
    };

    useEffect(() => {
        if (routeId) {
            axios.get(`${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}/${routeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }).then((response: AxiosResponse): void => {
                const {coordinates} = response.data;
                coordinates.forEach(({latitude, longitude, isVisited}: Geolocation): void => {
                    addMarker(latitude, longitude, undefined, isVisited === undefined ? false : isVisited);
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

        isAdmin() && mapRef.current.on("click", (e: leaflet.LeafletMouseEvent): void => {
            addMarker(e.latlng.lat, e.latlng.lng);
        });

        return (): void => {
            mapRef.current?.remove();
            markersMap.clear();
        };
    }, []);

    return (
        <>
            {isAdmin() && <CitySearch handleCitySelectForMap={(city: any): void => {
                addMarker(Number(city.lat), Number(city.lon));
            }}/>}
            <div id="map" ref={mapRef}></div>
        </>
    )
}

export default MapComponent;