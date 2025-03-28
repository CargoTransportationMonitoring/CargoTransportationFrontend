import React, {FC, JSX, MutableRefObject, useEffect, useRef} from "react";
import leaflet from "leaflet";
import CitySearch from "./CitySearch";
import "../../App.css";
import {isAdmin} from "../../util/KeycloakUtils";

export interface Geolocation {
    latitude: number,
    longitude: number,
    isVisited?: boolean,
    id?: number,
}

const MapComponent: FC<{
    markersArray: Array<Geolocation>;
    setMarkersArray: React.Dispatch<React.SetStateAction<Geolocation[]>>;
}> = ({markersArray, setMarkersArray}): JSX.Element => {
    const mapRef: MutableRefObject<leaflet.Map | null> = useRef<leaflet.Map | null>(null);
    const markersMap: MutableRefObject<Map<string, leaflet.Marker>> = useRef<Map<string, leaflet.Marker>>(new Map());
    const MAX_ZOOM: number = 19;
    const FRACTION_DIGITS: number = 6;

    const addMarker = (latitude: number, longitude: number, index?: number, isVisited: boolean = false): void => {
        const pointKey: string = `${latitude.toFixed(FRACTION_DIGITS)},${longitude.toFixed(FRACTION_DIGITS)}`;

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
                    if (isVisited) return
                    marker.remove();
                    markersMap.current.delete(pointKey);
                    setMarkersArray((prev: Geolocation[]) =>
                        prev.filter(
                            (m: Geolocation) =>
                                m.latitude.toFixed(FRACTION_DIGITS) !== latitude.toFixed(FRACTION_DIGITS) ||
                                m.longitude.toFixed(FRACTION_DIGITS) !== longitude.toFixed(FRACTION_DIGITS)
                        )
                    );
                });
            } else {
                marker.on("click", (): void => {
                    setMarkersArray((prev: Geolocation[]) =>
                        prev.map((marker: Geolocation) => {
                            if (marker.latitude.toFixed(FRACTION_DIGITS) === latitude.toFixed(FRACTION_DIGITS) &&
                                marker.longitude.toFixed(FRACTION_DIGITS) === longitude.toFixed(FRACTION_DIGITS)) {
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
                maxZoom: MAX_ZOOM,
                attribution: '',
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