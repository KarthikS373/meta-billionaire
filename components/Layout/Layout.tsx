import React, { useEffect, useRef, useState } from "react";
import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
  useToast,
} from "@chakra-ui/react";
import NextHeadSeo from "next-head-seo";
import Script from "next/script";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import useEthersProvider from "../../hooks/useEthersProvider";
import axios from "../../lib/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const Layout = (props: any) => {
  const { isOpen, onClose, address } = useEthersProvider();
  const [userNickName, setUserNickName] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const toast = useToast();

  const finalSaveUser = async () => {
    const { data } = await axios.post(`/createdUser`, {
      address: address,
      nickName: userNickName,
      token: token,
    });
    if (data) {
      setIsLoading(false);
      onClose();
      toast({
        description: "Username saved successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setIsLoading(false);
      onClose();
      toast({
        description: "An error occured",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (token && address) {
      finalSaveUser();
    }
  }, [token, address]);

  const saveUserName = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    if (!executeRecaptcha) {
      return;
    }
    const result = await executeRecaptcha("createUser");
    if (result) {
      setToken(result);
    } else {
      setIsLoading(false);
      toast({
        description:
          "An error occured with the robots verification, please try again...",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const myRef = useRef(null);
  //@ts-ignore
  const executeScroll = () => myRef!.current!.scrollIntoView();

  useEffect(() => {
    executeScroll();
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-M8Z5G730J3`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-M8Z5G730J3');
          `}
      </Script>
      <NextHeadSeo
        title="METABILLIONAIRE - DASHBOARD"
        description="METABILLIONAIRE - DASHBOARD"
        canonical="https://app.metabillionaire.com"
        robots="index, follow"
        og={{
          title: "METABILLIONAIRE - DASHBOARD",
          type: "website",
          url: "https://app.metabillionaire.com",
          image: "https://app.metabillionaire.com/favicon.ico",
          siteName: "METABILLIONAIRE - DASHBOARD",
        }}
        twitter={{
          card: "summary",
        }}
      />
      <Flex
        w="100%"
        h="100%"
        minH="100vh"
        bgColor="#ffffff"
        color="black"
        fontFamily="METAB, sans-serif"
        flexDir="column"
        alignItems="stretch"
        ref={myRef}
      >
        <Navbar />
        <Flex
          align="center"
          justify="center"
          flexDir="column"
          w="100%"
          alignItems="stretch"
          flex={1}
        >
          {props.children}
        </Flex>
        {!props.disableFooter && <Footer />}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader />
            <ModalCloseButton />
            <form onSubmit={saveUserName}>
              <ModalBody>
                <Text fontFamily="MontserratBold" fontSize={20}>
                  Choose a nickname :
                </Text>

                <Input
                  colorScheme="customBlue"
                  mt="sm"
                  fontSize={15}
                  type="text"
                  required
                  value={userNickName}
                  onChange={(e) => setUserNickName(e.target.value)}
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  fontSize={15}
                  letterSpacing={1}
                  size="md"
                  type="submit"
                  fontFamily="MontserratBold"
                  colorScheme="customBlue"
                  textTransform="uppercase"
                  isLoading={isLoading}
                >
                  Save
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};

export default Layout;
