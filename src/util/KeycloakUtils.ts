import {v4 as uuidv4} from 'uuid';

const ALGORITHM: string = 'SHA-256'

export const generateRandomState = (): string => {
    return uuidv4();
}

export const generateCodeVerifier = (): string => {
    const randomByteArray: Uint8Array = new Uint8Array(43);
    window.crypto.getRandomValues(randomByteArray);
    return base64URLEncode(randomByteArray);
}

export const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
    const codeVerifierByteArray: Uint8Array = new TextEncoder().encode(codeVerifier);
    const digest: ArrayBuffer = await window.crypto.subtle.digest(ALGORITHM, codeVerifierByteArray);
    return base64URLEncode(Array.from(new Uint8Array(digest)));
}

const base64URLEncode = (sourceValues: any): string => {
    const stringValue: string = String.fromCharCode.apply(null, sourceValues)
    const base64Encoded: string = btoa(stringValue)
    return base64Encoded.replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}
