import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Geolocation {
  latitude: number;
  longitude: number;
}

export default function useGeoLocation() {
  const [geoLocation, setGeoLocation] = useState<Geolocation>();

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          console.log(
            "Latitude: " +
              latitude +
              ", Longitude: " +
              longitude +
              ", Accuracy: " +
              accuracy
          );
          if (accuracy < 100) {
            setGeoLocation({ latitude: latitude, longitude: longitude });
          } else {
            toast.error(
              "Location accuracy is too low. Make sure your GPS is turn on."
            );
          }
        },
        (error) => {
          console.error("Error getting location", error);
          alert(
            "Error getting location. Make sure site has permission to access location."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
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
