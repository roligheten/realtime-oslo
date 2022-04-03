import { createContext, FunctionalComponent } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import {
    createJourneyPlannerApiClient,
    EnturJourneyPlannerApiClient,
} from "./api";

const EnturJourneyPlannerApiClientContext =
    createContext<EnturJourneyPlannerApiClient | null>(null);

export const EnturJourneyPlannerApiProvider: FunctionalComponent = ({
    children,
}) => {
    const [client, setClient] = useState<EnturJourneyPlannerApiClient>();

    useEffect(() => {
        const client = createJourneyPlannerApiClient();
        setClient(client);
    }, []);

    return client ? (
        <EnturJourneyPlannerApiClientContext.Provider value={client}>
            {children}
        </EnturJourneyPlannerApiClientContext.Provider>
    ) : null;
};

export const useEnturJourneyPlannerApiClient = () => {
    const client = useContext(EnturJourneyPlannerApiClientContext);

    if (!client) {
        throw new Error(
            "EnturJourneyPlannerApiClient either missing or undefined"
        );
    }
    return client;
};
