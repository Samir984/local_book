import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Geolocation {
  latitude: number;
  longitude: number;
  estimatedError: number;
}

export default function useGeoLocation() {
  const [geoLocation, setGeoLocation] = useState<Geolocation>();


  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
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
              latitude: latitude,
              longitude: longitude,
              estimatedError: estimatedError,
            });
          } else {
            toast.error(
              "Location  estimatedError is too hight. Make sure your GPS is turn on."
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
  return geoLocation;
}
