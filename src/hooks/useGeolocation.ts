import { useEffect, useState } from "react";

export interface Geolocation {
    latitude: number,
    longitude: number
}

const useGeolocation = (): Geolocation => {
    const [position, setPosition] = useState<Geolocation>({
        latitude: 0,
        longitude: 0,
    });

    useEffect(() => {
        const geo = navigator.geolocation;

        function onSuccess(position: any): void {
            setPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        }

        function onError(error: any): void {
            console.error("Error retrieving geolocation:", error);
        }

        const watcher: number = geo.watchPosition(onSuccess, onError);

        return () => geo.clearWatch(watcher);
    }, []);

    return position;
}

export default useGeolocation;