import React, {JSX, useEffect, useRef} from "react";
import leaflet from "leaflet";
import useLocalStorage from "../../hooks/useLocalStorage";
import useGeolocation, {Geolocation} from "../../hooks/useGeolocation";

const Map: React.FC = () : JSX.Element =>  {
    const mapRef: any = useRef();
    const userMarkerRef: any = useRef();

    const [userPosition, setUserPosition] = useLocalStorage("USER_MARKER", {
        latitude: 0,
        longitude: 0,
    });

    const [nearbyMarkers, setNearbyMarkers] = useLocalStorage<Geolocation[]>(
        "NEARBY_MARKERS",
        []
    );

    const location: Geolocation = useGeolocation();

    useEffect(() => {
        mapRef.current = leaflet
            .map("map")
            .setView([userPosition.latitude, userPosition.longitude], 13);

        leaflet
            .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            })
            .addTo(mapRef.current);

        nearbyMarkers.forEach(({ latitude, longitude }: Geolocation) => {
            leaflet
                .marker([latitude, longitude])
                .addTo(mapRef.current)
                .bindPopup(
                    `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
                );
        });

        mapRef.current.on("click", (e: leaflet.LeafletMouseEvent): void => {
            const { lat: latitude, lng: longitude } = e.latlng;
            leaflet
                .marker([latitude, longitude])
                .addTo(mapRef.current)
                .bindPopup(
                    `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
                );

            setNearbyMarkers((prevMarkers) => [
                ...prevMarkers,
                { latitude, longitude },
            ]);
        });
    }, []);

    useEffect((): void => {
        setUserPosition({ ...userPosition });

        if (userMarkerRef.current) {
            mapRef.current.removeLayer(userMarkerRef.current);
        }

        userMarkerRef.current = leaflet
            .marker([location.latitude, location.longitude])
            .addTo(mapRef.current)
            .bindPopup("User");

        const el = userMarkerRef.current.getElement();
        if (el) {
            el.style.filter = "hue-rotate(120deg)";
        }

        mapRef.current.setView([location.latitude, location.longitude]);
    }, [location, userPosition.latitude, userPosition.longitude]);
    return (
        <div id="map" ref={mapRef}></div>
    )
}

export default Map;