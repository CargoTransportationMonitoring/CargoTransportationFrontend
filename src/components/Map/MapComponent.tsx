import React, {JSX, useEffect, useRef} from "react";
import leaflet from "leaflet";
import {Geolocation} from "../../hooks/useGeolocation";
import CitySearch from "./CitySearch";
import "../../App.css";
import {isAdmin} from "../../util/KeycloakUtils";

const MapComponent: React.FC<{
    markersArray: Array<Geolocation>;
    setMarkersArray: React.Dispatch<React.SetStateAction<Geolocation[]>>;
    routeId: string | null;
}> = ({markersArray, setMarkersArray}): JSX.Element => {
    const mapRef = useRef<leaflet.Map | null>(null);
    const markersMap = useRef<Map<string, leaflet.Marker>>(new Map());

    const addMarker = (latitude: number, longitude: number, index?: number, isVisited: boolean = false): void => {
        const pointKey: string = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

        if (!markersMap.current.has(pointKey)) {
            const markerIndex: number = index !== undefined ? index + 1 : markersArray.length + 1;
            const visitedClass: "visited" | "not-visited" = isVisited ? "visited" : "not-visited";

            const customIcon: leaflet.DivIcon = leaflet.divIcon({
                className: `custom-marker ${visitedClass}`,
                html: `<div class="marker-content">${markerIndex}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            });

            const marker: leaflet.Marker = leaflet
                .marker([latitude, longitude], {icon: customIcon})
                .addTo(mapRef.current as leaflet.Map);
            markersMap.current.set(pointKey, marker);

            if (isAdmin()) {
                marker.on("click", (): void => {
                    marker.remove();
                    markersMap.current.delete(pointKey);
                    setMarkersArray((prev: Geolocation[]) =>
                        prev.filter(
                            (m: Geolocation) =>
                                m.latitude.toFixed(6) !== latitude.toFixed(6) ||
                                m.longitude.toFixed(6) !== longitude.toFixed(6)
                        )
                    );
                });
            } else {
                marker.on("click", (): void => {
                    setMarkersArray((prev: Geolocation[]) =>
                        prev.map((marker: Geolocation) => {
                            if (marker.latitude.toFixed(6) === latitude.toFixed(6) &&
                                marker.longitude.toFixed(6) === longitude.toFixed(6)) {
                                marker.isVisited = !marker.isVisited;
                            }
                            return marker;
                        })
                    );
                });
            }
        }
    };

    useEffect((): void => {
        markersMap.current.forEach((marker: leaflet.Marker) => marker.remove());
        markersMap.current.clear();

        markersArray.forEach((markerData: Geolocation, index: number): void => {
            addMarker(markerData.latitude, markerData.longitude, index, markerData.isVisited);
        });
    }, [markersArray]);

    useEffect(() => {
        mapRef.current = leaflet.map("map").setView([0, 0], 1);

        leaflet
            .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            })
            .addTo(mapRef.current);

        if (isAdmin()) {
            mapRef.current.on("click", (e: leaflet.LeafletMouseEvent): void => {
                setMarkersArray((prev: Geolocation[]) => [...prev, {
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                    isVisited: false
                }]);
            });
        }

        return (): void => {
            mapRef.current?.remove();
            markersMap.current.clear();
        };
    }, []);

    return (
        <>
            {isAdmin() && <CitySearch handleCitySelectForMap={(city: any): void => {
                addMarker(Number(city.lat), Number(city.lon));
                setMarkersArray((prev: Geolocation[]) => [...prev, {
                    latitude: Number(city.lat),
                    longitude: Number(city.lon),
                    isVisited: false
                }]);
            }}/>}
            <div id="map"></div>
        </>
    )
}

export default MapComponent;