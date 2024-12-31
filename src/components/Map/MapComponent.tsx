import React, {JSX, useEffect, useRef, useState} from "react";
import leaflet from "leaflet";
import {Geolocation} from "../../hooks/useGeolocation";

const MapComponent: React.FC = (): JSX.Element => {
    const mapRef: any = useRef();

    const [nearbyMarkers, setNearbyMarkers] = useState<Geolocation[]>([]);

    useEffect(() => {
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

        const markersMap: Map<string, leaflet.Marker> = new Map<string, leaflet.Marker>();

        nearbyMarkers.forEach(({latitude, longitude}: Geolocation): void => {
            const pointKey: string = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

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

            markersMap.set(pointKey, marker);
        });

        mapRef.current.on("click", (e: leaflet.LeafletMouseEvent): void => {
            const {lat: latitude, lng: longitude} = e.latlng;
            const pointKey: string = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

            if (!markersMap.has(pointKey)) {
                const newMarker: leaflet.Marker = leaflet
                    .marker([latitude, longitude])
                    .addTo(mapRef.current)
                    .bindPopup(
                        `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
                    );

                newMarker.on("click", (): void => {
                    newMarker.remove();
                    markersMap.delete(pointKey);
                    setNearbyMarkers((prevMarkers: Geolocation[]) =>
                        prevMarkers.filter(
                            (m: Geolocation) =>
                                m.latitude.toFixed(6) !== latitude.toFixed(6) ||
                                m.longitude.toFixed(6) !== longitude.toFixed(6)
                        )
                    );
                });

                markersMap.set(pointKey, newMarker);
                setNearbyMarkers((prevMarkers: Geolocation[]) => [
                    ...prevMarkers,
                    {latitude, longitude},
                ]);
            }
        });

        return (): void => {
            mapRef.current?.remove();
            markersMap.clear();
        };
    }, []);

    return (
        <div id="map" ref={mapRef}></div>
    )
}

export default MapComponent;