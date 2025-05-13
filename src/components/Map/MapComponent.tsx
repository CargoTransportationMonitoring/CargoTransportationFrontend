import React, {FC, JSX, MutableRefObject, useEffect, useRef} from "react";
import leaflet from "leaflet";
import CitySearch from "./CitySearch";
import "../../App.css";
import {isAdmin} from "../../util/KeycloakUtils";
import {startMonitoringGeolocation} from "../../util/GeolocationUtil";

export interface Geolocation {
    latitude: number,
    longitude: number,
    isVisited?: boolean,
    id?: number,
}

const MapComponent: FC<{
    markersArray: Array<Geolocation>;
    setMarkersArray: React.Dispatch<React.SetStateAction<Geolocation[]>>;
    routeStatus: "NEW" | "IN_PROGRESS" | "COMPLETED" | undefined,
    email: string
}> = ({markersArray, setMarkersArray, routeStatus, email}): JSX.Element => {
    const mapRef: MutableRefObject<leaflet.Map | null> = useRef<leaflet.Map | null>(null);
    const liveLocationMarkerRef: MutableRefObject<leaflet.Marker | null> = useRef<leaflet.Marker | null>(null);
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

            if (isAdmin() && routeStatus === "NEW") {
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
            } else if (!isAdmin() && routeStatus === "IN_PROGRESS") {
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

    const addLiveLocationMarker = (latitude: number, longitude: number): void => {
        const liveIcon: leaflet.DivIcon = leaflet.divIcon({
            className: "custom-marker live-marker",
            html: `<div class="marker-content">📍</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
        });

        if (liveLocationMarkerRef.current) {
            liveLocationMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
            liveLocationMarkerRef.current = leaflet.marker([latitude, longitude], {
                icon: liveIcon,
                interactive: false // 🔒 делает его некликабельным
            }).addTo(mapRef.current as leaflet.Map);
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
        if (!(routeStatus === "IN_PROGRESS" && !!email)) {
            return
        }
        const source: EventSource = startMonitoringGeolocation(
            email,
            (location: Geolocation): void => {
                console.log("Новая геолокация:", location);
                addLiveLocationMarker(location.latitude, location.longitude);
            },
            (error: Event): void => {
                console.error("Ошибка SSE:", error);
            }
        );

        return (): void => {
            source.close();
            if (liveLocationMarkerRef.current) {
                liveLocationMarkerRef.current.remove();
                liveLocationMarkerRef.current = null;
            }
        };
    })

    useEffect(() => {
        mapRef.current = leaflet.map("map").setView([0, 0], 1);

        leaflet
            .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: MAX_ZOOM,
                attribution: '',
            })
            .addTo(mapRef.current);

        if (isAdmin() && routeStatus === "NEW") {
            console.log("internal: ", routeStatus)
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
            <div className={"map-container"}>
                <div id="map"></div>
            </div>
        </>
    )
}

export default MapComponent;