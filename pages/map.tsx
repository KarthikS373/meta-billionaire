import { Button, Flex, Spinner, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useWindowSize } from "@react-hook/window-size";
import googleMapStyle from "../utils/googleMapStyle.json";
import useEthersProvider from "../hooks/useEthersProvider";
import axios from "../lib/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import prisma from "../lib/prisma";
import { GetServerSideProps } from "next";
const { useCurrentPosition } = require("react-use-geolocation");

const Map = ({ data }: any) => {
  const [width, height] = useWindowSize();
  const { address } = useEthersProvider();
  const [markers, setMarkers] = useState([]);
  const [token, setToken] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const toast = useToast();

  const center = {
    lat: 30.856614,
    lng: 2.3522219,
  };

  const addMarkerOnMap = async () => {
    let markerArray: any = [];
    await data.forEach((mapData: any) => {
      markerArray.push({
        id: mapData.id,
        wallet: mapData.wallet,
        position: { lat: Number(mapData.lat), lng: Number(mapData.lng) },
      });
    });
    setMarkers(markerArray);
  };

  useEffect(() => {
    addMarkerOnMap();
  }, []);

  const [position, error] = useCurrentPosition();

  const saveToMap = async () => {
    if (position.coords.longitude && position.coords.altitude) {
      await axios.post(`/map`, {
        address: address,
        lng: position.coords.longitude,
        lat: position.coords.altitude,
        token: token,
      });

      toast({
        description: "Position saved successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (token) {
      saveToMap();
    }
  }, [token]);

  const tryToFetch = async () => {
    if (!executeRecaptcha) {
      toast({
        description:
          "An error occured with the robots verification, please try again...",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    const result = await executeRecaptcha("getMap");
    if (result) {
      setToken(result);
    } else {
      toast({
        description:
          "An error occured with the robots verification, please try again...",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP!,
  });

  return (
    <Layout disableFooter={true}>
      <Flex w="100%" position="relative">
        {markers.length === 0 ? (
          <Spinner m="0 auto" size="xl" mt="lg" color="customBlue.500" />
        ) : isLoaded && width && height && !loadError ? (
          <>
            <Button
              fontSize={15}
              px="sm"
              mt="sm"
              borderRadius="full"
              colorScheme="customBlue"
              shadow="md"
              textTransform="uppercase"
              fontFamily="METAB"
              onClick={() => {
                if (address) {
                  if (position || !error) {
                    tryToFetch();
                  } else {
                    toast({
                      description:
                        "Error when retrieving the position, please enable localization in your browser",
                      status: "error",
                      duration: 4000,
                      isClosable: true,
                    });
                  }
                } else {
                  toast({
                    description: "Please connect your wallet",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                  });
                }
              }}
              position="absolute"
              zIndex={100}
              right={["25%", "25%", 20, 20]}
              top={5}
            >
              Add me on map
            </Button>
            <GoogleMap
              mapContainerStyle={{ width: width, height: height }}
              center={center}
              zoom={2.4}
              options={{
                styles: googleMapStyle,
                gestureHandling: "none",
                disableDefaultUI: true,
                minZoom: 2.7,
                maxZoom: 2.8,
                backgroundColor: "white",
              }}
            >
              {markers.map(({ id, wallet, position }) => (
                <Marker
                  key={id}
                  icon={{
                    url: address
                      ? wallet === address
                        ? "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                        : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                      : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                  position={position}
                />
              ))}
            </GoogleMap>
          </>
        ) : (
          <Spinner m="0 auto" size="xl" mt="lg" color="customBlue.500" />
        )}
      </Flex>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.map.findMany();

  return {
    props: { data },
  };
};

export default Map;
