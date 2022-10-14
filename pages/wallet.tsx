import {
  Text,
  Flex,
  Spacer,
  SimpleGrid,
  Icon,
  Spinner,
  IconButton,
  Link,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import useEthersProvider from "../hooks/useEthersProvider";
import OpenseaLogo from "../components/icons/OpenseaLogo/OpenseaLogo";
import { BiEdit, BiWallet } from "react-icons/bi";
import { ethers } from "ethers";
import contractMetabABI from "../contracts/metab/MetabABI.json";
import { toWeiWithDecimals } from "../utils/helpFunctions";
import contractABI from "../artifacts/contracts/MarketplaceERC20.sol/Marketplace.json";
import UserStoreItem from "../components/UserStoreItem/UserStoreItem";
import NftListContent from "../components/NftListContent/NftListContent";
const { getEthPriceNow } = require("get-eth-price");
import axios from "../lib/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Router from "next/router";

const MyWallet = () => {
  const [userData, setUserData] = useState<any>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const [nftLoading, setNftLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [numberOfMetab, setNumberOfMetab] = useState<number>(0);
  const [productsLength, setProductsLength] = useState<number>(0);
  const [newUserNickName, setNewUserNickName] = useState<string>("");
  const [cursorPage, setCursorPage] = useState<string>("");
  const [productsDataFinal, setProductsDataFinal] = useState<any>([]);
  const [token, setToken] = useState<string | null>(null);
  const [secondToken, setSecondToken] = useState<string | null>(null);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { address, loading, provider, disconnect } = useEthersProvider();
  const toast = useToast();

  //const address = "0xcfda9974d234FC548C7f96700B578aa90a367c8B";

  const fetchFinalUserData = async () => {
    const { data } = await axios.post(`/userData`, {
      address: address,
      cursorPage: cursorPage,
      token: token,
    });
    setUserData(data);
    await getMetab();
    setNftLoading(false);
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchFinalUserData();
    }
  }, [token]);

  const getUserData = async () => {
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
    const result = await executeRecaptcha("getUserData");
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

  useEffect(() => {
    if (address && cursorPage !== "") {
      setLoading(true);
      getUserData();
    }
  }, [cursorPage]);

  useEffect(() => {
    if (address) {
      setNftLoading(true);
      getUserData();
    }
  }, [address]);

  const updateFinalUser = async () => {
    const { data } = await axios.post(`/updateNickname`, {
      address: address,
      token: secondToken,
      nickname: newUserNickName,
    });

    if (data) {
      setEditMode(false);

      let userDataCopy: any = { ...userData };
      userDataCopy.user[0].name = data.data.name;

      setUserData(userDataCopy);

      toast({
        description: "Nickname updated successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setEditMode(false);
      toast({
        description: "An error occured",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (secondToken) {
      updateFinalUser();
    }
  }, [secondToken]);

  const updateNickName = async (e: any) => {
    e.preventDefault();
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
    const result = await executeRecaptcha("updateUser");
    if (result) {
      setSecondToken(result);
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

  const sum = (obj: any) => {
    var sum = 0;
    for (var el in obj) {
      if (obj.hasOwnProperty(el)) {
        sum += parseFloat(obj[el].stats.average_price);
      }
    }
    return sum;
  };

  const getMetab = async () => {
    const newProvider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_INFURA_MAIN_NET
    );
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_METAB_CONTRACT!,
      contractMetabABI,
      newProvider
    );
    try {
      const getBalanceOf = await contract.balanceOf(address);
      const balanceOfBigNumber = ethers.BigNumber.from(getBalanceOf._hex);
      const balanceOfResult = ethers.utils.formatEther(balanceOfBigNumber);
      const balanceOfFinal = toWeiWithDecimals(Number(balanceOfResult), 18);

      setNumberOfMetab(balanceOfFinal);
    } catch (err) {
      console.log("error when fetching Metab balance of");
      console.log(err);
    }
  };

  const getUserProducts = async () => {
    const newProvider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_POLYGON_API_KEY
    );
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
      contractABI.abi,
      newProvider
    );
    try {
      const userProductIdResult = await contract.getUserOwnedProducts(address);

      let productsDataArray: any = [];
      let finalProductsDataArray: any = [];

      if (userProductIdResult.length > 0) {
        Promise.all(
          (await userProductIdResult.map(async (product: any) => {
            const productIdBigNumber = ethers.BigNumber.from(product._hex);
            const productIdResult =
              ethers.utils.formatEther(productIdBigNumber);
            const productIdFinal = toWeiWithDecimals(
              Number(productIdResult),
              18
            );
            await productsDataArray.push(productIdFinal);
          })) &&
            (await productsDataArray.map(async (productId: number) => {
              const productsDataResult = await contract.products(productId);
              await finalProductsDataArray.push([productsDataResult]);
            }))
        ).then(() => {
          setProductsDataFinal(finalProductsDataArray);
        });
      }
    } catch (err) {
      console.log(
        "error when fetching user owned product on marketplace contract"
      );
      console.log(err);
    }
  };

  useEffect(() => {
    if (provider) {
      getUserProducts();
      getEthPriceNow().then((data: any) => {
        setProductsLength(data[Object.keys(data)[0]].ETH.USD);
      });
    }
  }, [provider]);

  return (
    <Layout>
      {address ? (
        <>
          <Flex
            align="center"
            justify="flex-start"
            w="100%"
            alignItems="stretch"
            flex={1}
            px={["sm", "sm", "md", "xl"]}
            py={["md", "md", "lg", "lg"]}
            flexDir="column"
          >
            <Flex
              align="center"
              justify="center"
              w="100%"
              flexDir={["column", "column", "row", "row"]}
            >
              <Flex align="flex-start" justify="center" flexDir="column">
                <Text fontSize={[30, 30, 35, 35]} color="black">
                  MY WALLET
                </Text>
              </Flex>
              <Spacer />

              <Flex
                flex={1}
                align="center"
                mt={["sm", "sm", 0, 0]}
                justify={["center", "center", "flex-end", "flex-end"]}
                w="100%"
              >
                <Button
                  fontSize={15}
                  px="sm"
                  borderRadius="full"
                  colorScheme="customBlue"
                  shadow="md"
                  mr="md"
                  textTransform="uppercase"
                  fontFamily="METAB"
                  leftIcon={<BiWallet size={20} />}
                  onClick={() => {
                    disconnect();
                    Router.back();
                  }}
                >
                  Disconnect
                </Button>
                <IconButton
                  as={Link}
                  isExternal
                  color="transparent"
                  bgColor="transparent"
                  href={"https://opensea.io/" + address}
                  aria-label="opensea"
                  icon={<OpenseaLogo size={50} />}
                  transition="all ease 0.3s"
                  _hover={{
                    transform: "scale(1.1)",
                  }}
                />
              </Flex>
            </Flex>
            <Flex
              align="center"
              justify="center"
              w="100%"
              mt="lg"
              bgColor="#e7e7e7"
              shadow="lg"
              borderRadius={20}
              py="md"
              px={["sm", "sm", "lg", "lg"]}
              flexDir="column"
            >
              <Flex
                w="100%"
                align="center"
                justify="center"
                flexDir={["column", "column", "row", "row"]}
              >
                <SimpleGrid
                  alignContent="center"
                  justifyContent="center"
                  flexDir="column"
                  columns={[1, 1, 1, 2]}
                  spacing={4}
                  mt={["md", "md", 0, 0]}
                  textAlign="center"
                  ml={[0, 0, "md", "md"]}
                >
                  <Flex
                    w="100%"
                    py="md"
                    px="lg"
                    bgColor="#fff"
                    shadow="md"
                    borderRadius={20}
                    flexDir="column"
                    align="center"
                    justify="center"
                  >
                    <Text fontSize={25} color="customBlue.500">
                      USERNAME
                    </Text>
                    {editMode ? (
                      <form onSubmit={updateNickName}>
                        <Input
                          required
                          colorScheme="customBlue"
                          fontSize={15}
                          type="text"
                          my="xs"
                          value={newUserNickName}
                          onChange={(e) => setNewUserNickName(e.target.value)}
                        />
                        <Flex align="center" justify="center" w="100%">
                          <Button
                            fontSize={[12, 12, 15, 15]}
                            px="sm"
                            onClick={() => setEditMode(false)}
                            borderRadius="full"
                            borderWidth={1}
                            borderColor="customBlue.500"
                            colorScheme="customBlue"
                            variant="outline"
                            _hover={{
                              color: "white",
                              bgColor: "customBlue.500",
                              borderColor: "white",
                            }}
                            shadow="md"
                            fontWeight={400}
                            ml="sm"
                          >
                            Cancel
                          </Button>

                          <Button
                            fontSize={[12, 12, 15, 15]}
                            px="sm"
                            type="submit"
                            borderRadius="full"
                            borderWidth={1}
                            borderColor="customBlue.500"
                            colorScheme="customBlue"
                            _hover={{
                              color: "customBlue.500",
                              bgColor: "white",
                              borderColor: "customBlue.500",
                            }}
                            shadow="md"
                            fontWeight={400}
                            ml="sm"
                          >
                            Save
                          </Button>
                        </Flex>
                      </form>
                    ) : (
                      <>
                        {!nftLoading ? (
                          userData.user && userData.user[0] ? (
                            <>
                              <Text fontSize={30}>{userData.user[0].name}</Text>
                              <Icon
                                cursor="pointer"
                                as={BiEdit}
                                color="customBlue.500"
                                w={30}
                                h={30}
                                onClick={() => setEditMode(true)}
                              />
                            </>
                          ) : (
                            <Text fontSize={30}>
                              {address.substring(0, 6)}...
                              {address.substring(
                                address.length - 4,
                                address.length
                              )}
                            </Text>
                          )
                        ) : (
                          <Spinner
                            m="0 auto"
                            size="xl"
                            color="customBlue.500"
                            my="sm"
                          />
                        )}
                      </>
                    )}
                  </Flex>
                  <Flex
                    w="100%"
                    py="md"
                    px="lg"
                    bgColor="#fff"
                    borderRadius={20}
                    flexDir="column"
                    align="center"
                    shadow="md"
                    justify="center"
                  >
                    <Text fontSize={25} color="customBlue.500">
                      MBUC BALANCE
                    </Text>
                    {!nftLoading ? (
                      userData.user && userData.user[0] ? (
                        <Text fontSize={30}>
                          {Number(userData.user[0].mbucBalance).toFixed(2)}
                        </Text>
                      ) : (
                        <Text fontSize={30}>0</Text>
                      )
                    ) : (
                      <Spinner
                        m="0 auto"
                        my="sm"
                        size="xl"
                        color="customBlue.500"
                      />
                    )}
                  </Flex>
                  <Flex
                    w="100%"
                    py="md"
                    px="lg"
                    bgColor="#fff"
                    shadow="md"
                    borderRadius={20}
                    flexDir="column"
                    align="center"
                    justify="center"
                  >
                    <Text fontSize={25} color="customBlue.500">
                      TOTAL ASSETS VALUE
                    </Text>
                    <Text fontSize={30}>
                      {!nftLoading ? (
                        <> {sum(userData.collection).toFixed(2)} ETH</>
                      ) : (
                        <Spinner
                          m="0 auto"
                          my="sm"
                          size="xl"
                          color="customBlue.500"
                        />
                      )}
                    </Text>
                  </Flex>
                  <Flex
                    w="100%"
                    py="md"
                    px="lg"
                    bgColor="#fff"
                    borderRadius={20}
                    flexDir="column"
                    align="center"
                    shadow="md"
                    justify="center"
                  >
                    <Text fontSize={25} color="customBlue.500">
                      TOTAL ASSETS VALUE
                    </Text>
                    <Text fontSize={30}>
                      {!nftLoading ? (
                        <>
                          {(sum(userData.collection) * productsLength).toFixed(
                            2
                          )}
                          $
                        </>
                      ) : (
                        <Spinner
                          m="0 auto"
                          my="sm"
                          size="xl"
                          color="customBlue.500"
                        />
                      )}
                    </Text>
                  </Flex>
                  <Flex
                    w="100%"
                    py="md"
                    px="lg"
                    bgColor="#fff"
                    borderRadius={20}
                    flexDir="column"
                    align="center"
                    shadow="md"
                    justify="center"
                  >
                    <Text fontSize={25} color="customBlue.500">
                      NUMBER OF NFT
                    </Text>
                    <Text fontSize={30}>
                      {!nftLoading ? (
                        <>
                          {userData.data && userData.data.assets.length !== 50
                            ? userData.data.assets.length
                            : "+50"}
                        </>
                      ) : (
                        <Spinner
                          m="0 auto"
                          my="sm"
                          size="xl"
                          color="customBlue.500"
                        />
                      )}
                    </Text>
                  </Flex>{" "}
                  <Flex
                    w="100%"
                    py="md"
                    px="lg"
                    bgColor="#fff"
                    borderRadius={20}
                    flexDir="column"
                    align="center"
                    shadow="md"
                    justify="center"
                  >
                    <Text fontSize={25} color="customBlue.500">
                      NUMBER OF METAB
                    </Text>
                    <Text fontSize={30}>
                      {!nftLoading ? (
                        <>{numberOfMetab || 0}</>
                      ) : (
                        <Spinner
                          m="0 auto"
                          my="sm"
                          size="xl"
                          color="customBlue.500"
                        />
                      )}
                    </Text>
                  </Flex>
                </SimpleGrid>
              </Flex>
              <Flex
                mt={["lg", "lg", "xl", "xl"]}
                flexDir="column"
                align="center"
                justify="center"
                w="100%"
              >
                <Text color="black" mb="md" fontSize={35}>
                  MY PRODUCTS
                </Text>

                {productsDataFinal ? (
                  productsDataFinal.length > 0 ? (
                    productsDataFinal.map((product: any, key: number) => {
                      return (
                        <UserStoreItem
                          key={key}
                          data={product[0]}
                          userProduct={userData.products}
                          getUserData={getUserData}
                        />
                      );
                    })
                  ) : (
                    <Flex align="center" justify="center" flex={1}>
                      <Text
                        fontSize={25}
                        fontFamily="MontserratBold"
                        color="customBlue.500"
                        textAlign="center"
                      >
                        You have no products
                      </Text>
                    </Flex>
                  )
                ) : (
                  <Spinner
                    m="0 auto"
                    size="xl"
                    mt="lg"
                    color="customBlue.500"
                  />
                )}
              </Flex>
              <Flex
                mt={["lg", "lg", "xl", "xl"]}
                flexDir="column"
                align="center"
                justify="center"
                w="100%"
              >
                <Text color="black" fontSize={35}>
                  MY NFTs
                </Text>

                {isLoading || loading || userData.data === undefined ? (
                  <Spinner
                    m="0 auto"
                    size="xl"
                    mt="lg"
                    color="customBlue.500"
                  />
                ) : (
                  <NftListContent
                    userData={userData}
                    setCursorPage={setCursorPage}
                    isLoading={isLoading}
                  />
                )}
              </Flex>
            </Flex>
          </Flex>
        </>
      ) : (
        <Flex align="center" justify="center">
          <Text fontSize={25} color="customBlue.500">
            Connect your wallet
            <br /> to access this page
          </Text>
        </Flex>
      )}
    </Layout>
  );
};

export default MyWallet;
