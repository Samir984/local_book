/* eslint-disable react-refresh/only-export-components */
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { createContext } from "react";

interface Geolocation {
  latitude: number | null;
  longitude: number | null;
  estimatedError: number | null;
}

const GeoLocationContext = createContext<Geolocation>({
  latitude: null,
  longitude: null,
  estimatedError: null,
});

export default function GeoLocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [geoLocation, setGeoLocation] = useState<Geolocation>({
    latitude: null,
    longitude: null,
    estimatedError: null,
  });

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const estimatedError = position.coords.accuracy;
          console.log(
            "Latitude: " +
              latitude +
              ", Longitude: " +
              longitude +
              ",  estimatedError: " +
              estimatedError
          );
          if (estimatedError < 300) {
            setGeoLocation({
              latitude,
              longitude,
              estimatedError,
            });
          } else {
            toast.error(
              "Location  estimatedError is too high. Make sure your GPS is turn on."
            );
          }
        },
        (error) => {
          console.error("Error getting location", error);
          toast.error(
            "Error getting location. Make sure site has permission to access location."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    getLocation();
  }, []);
  return (
    <GeoLocationContext.Provider
      value={{
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
        estimatedError: geoLocation.estimatedError,
      }}
    >
      {children}
    </GeoLocationContext.Provider>
  );
}

export const useGeoLocation = function () {
  const geolocation = useContext(GeoLocationContext);
  if (!geolocation) {
    throw new Error("useGeoLocation must be used within a GeoLocationProvider");
  }
  return geolocation;
};
