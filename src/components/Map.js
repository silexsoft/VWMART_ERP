import React, { useEffect, useState, useRef } from "react";

const Map = ({
  address,
  setCordsWrapper,
  setModifiedAddrssWrapper,
  setModifiedAddrsObjWrapper,
  geoCords,
  searchInputRef,
}) => {
  geoCords = [0.014121468050843422, 0.0060157256003012805];
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  // ✅ Load Google Maps API once
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src^="https://maps.googleapis.com/maps/api/js"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBzVxMnYB0bervnV8js-3Z1pWxTvoq1EDo&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    } else {
      existingScript.onload = () => setIsLoaded(true);
    }
  }, []);
  useEffect(() => {
    if (!isLoaded || !geoCords || geoCords.length !== 2) return;

    const { google } = window;
    geocoderRef.current = new google.maps.Geocoder();

    const mapOptions = {
      center: new google.maps.LatLng(geoCords[0], geoCords[1]),
      zoom: 15,
    };

    mapRef.current = new google.maps.Map(
      document.getElementById("map"),
      mapOptions,
    );

    markerRef.current = new google.maps.Marker({
      position: new google.maps.LatLng(geoCords[0], geoCords[1]),
      map: mapRef.current,
      draggable: true,
    });

    // ✅ Update coordinates when marker is dragged
    markerRef.current.addListener("dragend", () => {
      const newPosition = markerRef.current.getPosition();
      setCordsWrapper([newPosition.lat(), newPosition.lng()]);

      // ✅ Reverse Geocoding
      geocoderRef.current.geocode(
        { location: { lat: newPosition.lat(), lng: newPosition.lng() } },
        (results, status) => {
          if (status === "OK" && results[0]) {
            setModifiedAddrsObjWrapper(results[0]);
            setModifiedAddrssWrapper(results[0].formatted_address);
          }
        },
      );
    });

    // ✅ Update coordinates when the map is moved
    mapRef.current.addListener("idle", () => {
      const newCenter = mapRef.current.getCenter();
      const newLat = newCenter.lat();
      const newLng = newCenter.lng();

      setCordsWrapper((prevState) => {
        if (prevState[0] !== newLat || prevState[1] !== newLng) {
          return [newLat, newLng]; // Only update if coordinates have changed
        }
        return prevState;
      });

      // ✅ Reverse Geocoding when map stops moving
      geocoderRef.current.geocode(
        { location: { lat: newLat, lng: newLng } },
        (results, status) => {
          if (status === "OK" && results[0]) {
            setModifiedAddrsObjWrapper(results[0]);
            setModifiedAddrssWrapper(results[0].formatted_address);
          }
        },
      );
    });

    // ✅ Initialize Autocomplete
    const input = document.getElementById("pac-input");
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo("bounds", mapRef.current);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        markerRef.current.setPosition(place.geometry.location);
        mapRef.current.setCenter(place.geometry.location);
        setModifiedAddrsObjWrapper(place);
        setCordsWrapper([
          place.geometry.location.lat(),
          place.geometry.location.lng(),
        ]);
      });
    }
  }, [isLoaded, geoCords]); // ✅ Now useEffect will run when geoCords updates!

  // ✅ Initialize Map and Marker
  // useEffect(() => {
  //   if (!isLoaded || !geoCords || geoCords.length !== 2) return;

  //   const { google } = window;
  //   geocoderRef.current = new google.maps.Geocoder();

  //   const mapOptions = {
  //     center: new google.maps.LatLng(geoCords[0], geoCords[1]),
  //     zoom: 15,
  //   };

  //   mapRef.current = new google.maps.Map(
  //     document.getElementById("map"),
  //     mapOptions,
  //   );

  //   markerRef.current = new google.maps.Marker({
  //     position: new google.maps.LatLng(geoCords[0], geoCords[1]),
  //     map: mapRef.current,
  //     draggable: true,
  //   });

  //   // ✅ Update coordinates when marker is dragged
  //   markerRef.current.addListener("dragend", () => {
  //     const newPosition = markerRef.current.getPosition();
  //     const newLat = newPosition.lat();
  //     const newLng = newPosition.lng();
  //     setCordsWrapper([newLat, newLng]);

  //     // ✅ Reverse Geocoding
  //     geocoderRef.current.geocode(
  //       { location: { lat: newLat, lng: newLng } },
  //       (results, status) => {
  //         if (status === "OK" && results[0]) {
  //           setModifiedAddrsObjWrapper(results[0]);
  //           setModifiedAddrssWrapper(results[0].formatted_address);
  //         }
  //       },
  //     );
  //   });

  //   // ✅ Initialize Autocomplete
  //   const input = document.getElementById("pac-input");
  //   if (input) {
  //     const autocomplete = new google.maps.places.Autocomplete(input);
  //     autocomplete.bindTo("bounds", mapRef.current);

  //     autocomplete.addListener("place_changed", () => {
  //       const place = autocomplete.getPlace();
  //       if (!place.geometry || !place.geometry.location) return;

  //       markerRef.current.setPosition(place.geometry.location);
  //       mapRef.current.setCenter(place.geometry.location);
  //       setModifiedAddrsObjWrapper(place);
  //       setCordsWrapper([
  //         place.geometry.location.lat(),
  //         place.geometry.location.lng(),
  //       ]);
  //     });
  //   }
  // }, [isLoaded, geoCords]);

  return (
    <>
      <div>
        <input
          id="pac-input"
          className="controls"
          type="text"
          placeholder="Search Box"
          ref={searchInputRef}
        />
      </div>
      <div id="map" style={{ height: "400px", width: "100%" }}></div>
    </>
  );
};

export default Map;
