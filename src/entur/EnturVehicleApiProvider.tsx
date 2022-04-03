import { createContext, FunctionalComponent } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { createVehicleApiClient, EnturVehicleApiClient } from "./api";

const EnturVehicleApiClientContext =
    createContext<EnturVehicleApiClient | null>(null);

export const EnturVehicleApiProvider: FunctionalComponent = ({ children }) => {
    const [client, setClient] = useState<EnturVehicleApiClient>();

    useEffect(() => {
        const client = createVehicleApiClient();
        setClient(client);
    }, []);

    return client ? (
        <EnturVehicleApiClientContext.Provider value={client}>
            {children}
        </EnturVehicleApiClientContext.Provider>
    ) : null;
};

export const useEnturVehicleApiClient = () => {
    const client = useContext(EnturVehicleApiClientContext);

    if (!client) {
        throw new Error("EnturVehicleApiClient either missing or undefined");
    }
    return client;
};
