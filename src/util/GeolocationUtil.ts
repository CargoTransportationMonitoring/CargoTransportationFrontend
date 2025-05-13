import {Client} from "@stomp/stompjs";
import {TokenId} from "./KeycloakUtils";
import {Geolocation} from "../components/Map/MapComponent";
import axios, {AxiosResponse} from "axios";
import {setError} from "../redux/slices/InfoTabSlice";

type LocationMessageType = {
    latitude: number,
    longitude: number,
    time: string,
    email: string
}

export const startSharingLocation = (tokenData: TokenId, client: Client): number => {

    const sendLocation = (): void => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition): void => {
                const locationMessage: LocationMessageType = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    time: new Date().toISOString(),
                    email: tokenData.email
                };

                console.log('Отправка геолокации:', locationMessage);

                client.publish({
                    destination: '/app/message',
                    body: JSON.stringify(locationMessage),
                });
            },
            (error: GeolocationPositionError): void => {
                console.error('Ошибка получения геолокации:', error);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 0,
                timeout: 5000
            }
        );
    };

    // Отправить позицию сразу
    sendLocation();

    // Затем каждые 10 секунд
    return window.setInterval(sendLocation, 10000);
};

export const startMonitoringGeolocation = (
    email: string,
    onMessage: (location: Geolocation) => void,
    onError?: (error: Event) => void
): EventSource => {
    const eventSource: EventSource = new EventSource(`http://localhost:8084/sse/stream?email=${encodeURIComponent(email)}`);

    eventSource.onmessage = (event: MessageEvent): void => {
        try {
            const data: Geolocation = JSON.parse(event.data);
            onMessage(data);
        } catch (e) {
            console.error("Ошибка при парсинге данных геолокации:", e);
        }
    };

    eventSource.onerror = (event: Event): void => {
        console.error("SSE ошибка:", event);
        if (onError) {
            onError(event);
        }
        eventSource.close();
    };

    return eventSource;
};

export default startSharingLocation;