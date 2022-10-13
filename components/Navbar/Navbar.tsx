import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  Button,
  Spacer,
  Icon,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Menu,
  MenuButton,
  MenuList,
  useDisclosure,
  Link as ChakraLink,
  chakra,
  Spinner,
} from "@chakra-ui/react";
import { BiMenu, BiWallet } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import useEthersProvider from "../../hooks/useEthersProvider";
import Link from "next/link";
import { useRouter } from "next/router";
import { gasstationInfo } from "eth-gasprice-estimator";
const { getEthPriceNow } = require("get-eth-price");

const Navbar = () => {
  const [ethPrice, setEthPrice] = useState<number>();
  const [gweiPrice, setGweiPrice] = useState<number>();

  const { connect, address } = useEthersProvider();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = React.useRef();

  const navbar_menu=[
    {
      name : "Home",
      link : "/"
    },
    {
      name : "Content",
      link : "https://content.metabillionaire.com/"
    },
    {
      name : "MarketPlace",
      link : "/marketplace"
    },
    {
      name : "Roadmap",
      link : "/roadmap"
    },
    {
      name : "Teams",
      link : "/teams"
    },
    {
      name : "Map",
      link : "/map"
    },
    {
      name : "Faq",
      link : "/faq"
    },
  ]


  useEffect(() => {
    getEthPriceNow().then((data: any) => {
      setEthPrice(data[Object.keys(data)[0]].ETH.USD);
    });

    gasstationInfo("fastest").then((result: any) => {
      setGweiPrice(result);
    });
  }, []);



  return (
    <>
      <Flex
        align="center"
        justify={["center", "center", "center", "flex-start"]}
        w="100%"
        fontFamily="MontserratBold"
        px={["xs", "xs", "xs", "md"]}
        transition="all ease 0.5s"
        shadow="lg"
        bgColor="#0f0f0f"
        color="white"
        zIndex={1000}
        textTransform="uppercase"
        py="sm"
        position="sticky"
        top={0}
      >
        <IconButton
          aria-label="open menu"
          display={["flex", "flex", "flex", "none"]}
          icon={<BiMenu />}
          position="absolute"
          left={5}
          _hover={{
            bgColor: "customBlue.500",
            borderColor: "customBlue.500",
          }}
          _active={{
            bgColor: "customBlue.500",
            borderColor: "customBlue.500",
          }}
          //@ts-ignore
          ref={btnRef}
          variant="outline"
          onClick={onOpen}
        />
        <Link passHref href="/">
          <Image
            src="/logo3.png"
            alt="metabillionaire logo"
            paddingLeft="md"
            marginX="auto"
            width={170}
            height={75}
            cursor="pointer"
          />
        </Link>
        <Box
          fontSize={17}
          cursor="pointer"
          display={['block','block','block','none']}
        >
          <Link passHref href="https://opensea.io/collection/metabillionaire">
            <Image src="/opensea.svg" alt="open Sea Logo" w="30px" display="inline" pb="2px"/>
          </Link>
        </Box>
        <Box
            fontSize={17}
            cursor="pointer"
            p="2px"
            mx="xs"
            bgColor="#2081e2"
            borderRadius="50%"
            display={['block','block','block','none']}
        >
          <Link passHref href="https://shop.metabillionaire.com/">
            <Icon as={FaShoppingCart} size="20" m="5px"/>
          </Link>
        </Box>
        <Flex
          justify="center"
          align="center"
          display={["none", "none", "none", "flex"]}
          w="100%"
          ml={[0, 0, 0, "md"]}
        >
          <Menu>
            <MenuButton as={Box}>
              Menu ▼
            </MenuButton>
            <MenuList
              bgColor="black"
              border="0px"
            >
              {navbar_menu.map((option) => {
                return (
                  <Box p="3px" key={option.name}>
                    <Link passHref href={option.link}>
                      <Text
                        fontSize={17}
                        px="sm"
                        cursor="pointer"
                        _hover={{
                          color: "customBlue.500",
                        }}
                        mr="sm"
                      >{option.name}</Text>
                    </Link>
                  </Box>
                )})}
            </MenuList>
          </Menu>
          <Spacer />
          <Box
            fontSize={17}

            cursor="pointer"
          >
            <Link passHref href="https://opensea.io/collection/metabillionaire">
              <Image src="/opensea.svg" alt="open Sea Logo" w="30px" display="inline" pb="2px"/>
            </Link>
          </Box>
          <Box
            fontSize={17}
            cursor="pointer"
            p="2px"
            mx="xs"
            bgColor="#2081e2"
            borderRadius="50%"
          >
            <Link passHref href="https://shop.metabillionaire.com/">
              <Icon as={FaShoppingCart} size="20" m="5px"/>
            </Link>
          </Box>
          {address ? (
            <>
              <Button
                fontSize={[12, 12, 15, 15]}
                px="sm"
                borderRadius="full"
                shadow="md"
                textTransform="uppercase"
                fontFamily="METAB"
                bgColor="white"
                color="customBlue.500"
                _hover={{
                  bgColor: "customBlue.500",
                  color: "white",
                  textDecor: "none",
                }}
                as={ChakraLink}
                isExternal
                href="https://staking.metabillionaire.com/#/home"
              >
                Staking
              </Button>
              <Flex
                flexDir="column"
                justify="center"
                align="center"
                position="relative"
                mx="sm"
              >
                <Button
                  fontSize={15}
                  px="sm"
                  borderRadius="full"
                  colorScheme="customBlue"
                  shadow="md"
                  textTransform="uppercase"
                  fontFamily="METAB"
                  leftIcon={<BiWallet size={20} />}
                  onClick={() => router.push("/wallet")}
                >
                  My Wallet
                </Button>
                <Text
                  color="white"
                  fontSize={13}
                  position="absolute"
                  bottom={-5}
                >
                  {address.substring(0, 6)}...
                  {address.substring(address.length - 4, address.length)}
                </Text>
              </Flex>
              <Flex align="center" flexDir="column" justify="center">
                {ethPrice ? (
                  <Text fontSize={12} textAlign="center">
                    ETH PRICE :<br />{" "}
                    <chakra.span color="customBlue.400" fontSize={15}>
                      {ethPrice}$
                    </chakra.span>
                  </Text>
                ) : (
                  <>
                    <Text fontSize={12} textAlign="center">
                      ETH PRICE :
                    </Text>
                    <Spinner m="0 auto" size="sm" color="customBlue.500" />
                  </>
                )}

                {gweiPrice ? (
                  <Text fontSize={12} textAlign="center">
                    ETH GAS :<br />{" "}
                    <chakra.span color="customBlue.400" fontSize={15}>
                      {gweiPrice! / 1000000000} Gwei
                    </chakra.span>
                  </Text>
                ) : (
                  <>
                    <Text fontSize={12} textAlign="center">
                      ETH GAS :
                    </Text>
                    <Spinner m="0 auto" size="sm" color="customBlue.500" />
                  </>
                )}
              </Flex>
            </>
          ) : (
            <>
              <Button
                fontSize={[12, 12, 15, 15]}
                px="sm"
                borderRadius="full"
                shadow="md"
                textTransform="uppercase"
                fontFamily="METAB"
                bgColor="white"
                color="customBlue.500"
                _hover={{
                  bgColor: "customBlue.500",
                  color: "white",
                  textDecor: "none",
                }}
                as={ChakraLink}
                isExternal
                href="https://staking.metabillionaire.com/#/home"
              >
                Staking
              </Button>
              <Button
                fontSize={[12, 12, 15, 15]}
                px="sm"
                mx="sm"
                borderRadius="full"
                colorScheme="customBlue"
                shadow="md"
                leftIcon={<BiWallet size={20} />}
                textTransform="uppercase"
                fontFamily="METAB"
                onClick={() => connect()}
              >
                Connect
              </Button>
              <Flex align="center" flexDir="column" justify="center">
                {ethPrice ? (
                  <Text fontSize={12} textAlign="center">
                    ETH PRICE :<br />{" "}
                    <chakra.span color="customBlue.400" fontSize={15}>
                      {ethPrice}$
                    </chakra.span>
                  </Text>
                ) : (
                  <>
                    <Text fontSize={12} textAlign="center">
                      ETH PRICE :
                    </Text>
                    <Spinner m="0 auto" size="sm" color="customBlue.500" />
                  </>
                )}

                {gweiPrice ? (
                  <Text fontSize={12} textAlign="center">
                    ETH GAS :<br />{" "}
                    <chakra.span color="customBlue.400" fontSize={15}>
                      {gweiPrice! / 1000000000} Gwei
                    </chakra.span>
                  </Text>
                ) : (
                  <>
                    <Text fontSize={12} textAlign="center">
                      ETH GAS :
                    </Text>
                    <Spinner m="0 auto" size="sm" color="customBlue.500" />
                  </>
                )}
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        //@ts-ignore
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bgColor="#000">
          <DrawerCloseButton color="white" />
          <DrawerHeader />

          <DrawerBody>
            <Link passHref href="/">
              <Image
                src="/logo3.png"
                alt="metabillionaire logo"
                width={170}
                height={75}
                m="0 auto"
              />
            </Link>
            <Flex
              justify="center"
              align="flex-start"
              w="100%"
              mt="md"
              flexDir="column"
              color="white"
            >
              {navbar_menu.map((option) => {
                return (
                  <Box
                    fontSize={17}
                    px="sm"
                    my="xs"
                    cursor="pointer"
                    onClick={() => onClose()}
                    _hover={{
                      color: "customBlue.500",
                    }}
                    key={option.name}>
                    <Link passHref href={option.link}>
                      <Text
                        fontSize={17}
                        px="sm"
                        cursor="pointer"
                        _hover={{
                          color: "customBlue.500",
                        }}
                        mr="sm"
                      >{option.name}</Text>
                    </Link>
                  </Box>
                )})}
              <Spacer />
              {address ? (
                <>
                  <Button
                    fontSize={15}
                    px="sm"
                    mt="md"
                    borderRadius="full"
                    shadow="md"
                    textTransform="uppercase"
                    fontFamily="METAB"
                    bgColor="white"
                    color="customBlue.500"
                    _hover={{
                      bgColor: "customBlue.500",
                      color: "white",
                      textDecor: "none",
                    }}
                    as={ChakraLink}
                    isExternal
                    href="https://staking.metabillionaire.com/#/home"
                    w="100%"
                  >
                    Staking
                  </Button>
                  <Flex
                    flexDir="column"
                    justify="center"
                    align="center"
                    w="100%"
                  >
                    <Button
                      fontSize={15}
                      px="sm"
                      mt="sm"
                      borderRadius="full"
                      colorScheme="customBlue"
                      shadow="md"
                      textTransform="uppercase"
                      fontFamily="METAB"
                      leftIcon={<BiWallet size={20} />}
                      w="100%"
                      onClick={() => {
                        router.push("/wallet");
                        onClose();
                      }}
                    >
                      My Wallet
                    </Button>
                    <Text color="white" mt="xs" fontSize={13}>
                      {address.substring(0, 6)}...
                      {address.substring(address.length - 4, address.length)}
                    </Text>
                  </Flex>
                  <Flex
                    align="center"
                    w="100%"
                    mt="md"
                    flexDir="column"
                    justify="center"
                  >
                    {ethPrice ? (
                      <Text mb="xs" fontSize={12} textAlign="center">
                        ETH PRICE :<br />{" "}
                        <chakra.span color="customBlue.400" fontSize={15}>
                          {ethPrice}$
                        </chakra.span>
                      </Text>
                    ) : (
                      <>
                        <Text mb="xs" fontSize={12} textAlign="center">
                          ETH PRICE :
                        </Text>
                        <Spinner m="0 auto" size="sm" color="customBlue.500" />
                      </>
                    )}

                    {gweiPrice ? (
                      <Text mb="xs" fontSize={12} textAlign="center">
                        ETH GAS :<br />{" "}
                        <chakra.span color="customBlue.400" fontSize={15}>
                          {gweiPrice! / 1000000000} Gwei
                        </chakra.span>
                      </Text>
                    ) : (
                      <>
                        <Text fontSize={12} textAlign="center">
                          ETH GAS :
                        </Text>
                        <Spinner
                          m="0 auto"
                          size="sm"
                          mb="xs"
                          color="customBlue.500"
                        />
                      </>
                    )}
                  </Flex>
                </>
              ) : (
                <>
                  <Button
                    fontSize={15}
                    px="sm"
                    borderRadius="full"
                    shadow="md"
                    mt="md"
                    textTransform="uppercase"
                    fontFamily="METAB"
                    bgColor="white"
                    color="customBlue.500"
                    _hover={{
                      bgColor: "customBlue.500",
                      color: "white",
                      textDecor: "none",
                    }}
                    as={ChakraLink}
                    isExternal
                    href="https://staking.metabillionaire.com/#/home"
                    w="100%"
                  >
                    Staking
                  </Button>
                  <Button
                    fontSize={15}
                    px="sm"
                    mt="sm"
                    borderRadius="full"
                    colorScheme="customBlue"
                    shadow="md"
                    leftIcon={<BiWallet size={20} />}
                    textTransform="uppercase"
                    fontFamily="METAB"
                    onClick={() => {
                      connect();
                      onClose();
                    }}
                    w="100%"
                  >
                    Connect
                  </Button>
                  <Flex
                    align="center"
                    w="100%"
                    mt="md"
                    flexDir="column"
                    justify="center"
                  >
                    {ethPrice ? (
                      <Text mb="xs" fontSize={12} textAlign="center">
                        ETH PRICE :<br />{" "}
                        <chakra.span color="customBlue.400" fontSize={15}>
                          {ethPrice}$
                        </chakra.span>
                      </Text>
                    ) : (
                      <>
                        <Text mb="xs" fontSize={12} textAlign="center">
                          ETH PRICE :
                        </Text>
                        <Spinner m="0 auto" size="sm" color="customBlue.500" />
                      </>
                    )}

                    {gweiPrice ? (
                      <Text mb="xs" fontSize={12} textAlign="center">
                        ETH GAS :<br />{" "}
                        <chakra.span color="customBlue.400" fontSize={15}>
                          {gweiPrice! / 1000000000} Gwei
                        </chakra.span>
                      </Text>
                    ) : (
                      <>
                        <Text fontSize={12} textAlign="center">
                          ETH GAS :
                        </Text>
                        <Spinner
                          m="0 auto"
                          size="sm"
                          mb="xs"
                          color="customBlue.500"
                        />
                      </>
                    )}
                  </Flex>
                </>
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
