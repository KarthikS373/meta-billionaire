import {
  Text,
  Spacer,
  Flex,
  Image,
  Link,
  IconButton,
  chakra,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import OpenseaLogo from "../../../components/icons/OpenseaLogo/OpenseaLogo";
import { ethers } from "ethers";
import WalletPourcentage from "../../../components/WalletPourcentage/WalletPourcentage";
import useEthersProvider from "../../../hooks/useEthersProvider";
import prisma from "../../../lib/prisma";
import { AiFillCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { useRouter } from "next/router";
import api from "../../../lib/api";
import axios from "axios";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const NftPage = ({ data, collection, nftData }: any) => {
  const [priceValue, setPriceValue] = useState<string>(
    nftData[0] ? nftData[0].userPrice : "0"
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const { address } = useEthersProvider();
  const toast = useToast();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const finalSaveNftStat = async () => {
    const { data: response } = await api.post(`/nftSave`, {
      tokenId: data[0].token_id,
      address: address,
      collectionSlug: data[0].collection.slug,
      userPrice: priceValue,
      token: token,
    });

    setEditMode(false);
    refreshData();
    toast({
      description: response.message,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (token) {
      finalSaveNftStat();
    }
  }, [token]);

  const saveNftStat = async (e: any) => {
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
    const result = await executeRecaptcha("saveNftStat");
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

  const format = (val: any) => val + ` ETH`;

  return (
    <Layout>
      <Flex
        align="center"
        justify="flex-start"
        w="100%"
        alignItems="stretch"
        flex={1}
        px={["md", "md", "xl", "xl"]}
        py="lg"
        flexDir="column"
      >
        <Flex align="center" flexDir="column" justify="center" w="100%">
          {data && data[0] ? (
            <>
              <Flex align="flex-start" justify="center" w="100%">
                <Text fontSize={35} color="customBlue.500">
                  NFT Stats
                </Text>
                <Spacer />
              </Flex>
              <Flex
                align="center"
                justify="center"
                w="100%"
                mt={["md", "md", "lg", "lg"]}
                bgColor="#e7e7e7"
                shadow="lg"
                borderRadius={20}
                py="md"
                px={["sm", "sm", "md", "md"]}
                flexDir={["column", "column", "row", "row"]}
              >
                <Flex
                  align="stretch"
                  w="100%"
                  justify="center"
                  flexDir={["column", "column", "column", "row"]}
                >
                  <Flex
                    bgColor="#fff"
                    borderRadius={20}
                    align="flex-start"
                    justify="flex-start"
                    shadow="lg"
                    mb={["md", "md", "md", 0]}
                    flexDir="column"
                    minW={["unset", "unset", "unset", "25%"]}
                  >
                    <Image
                      src={collection.banner_image_url}
                      alt={collection.name}
                      objectFit="cover"
                      w={["100%", "100%", "100%", 400]}
                      h={["100%", "100%", "100%", 150]}
                      shadow="lg"
                      borderRadius={15}
                    />
                    <Flex w="100%" flexDir="column" py="sm" px="sm">
                      <Text
                        w="100%"
                        textAlign="left"
                        fontSize={13}
                        opacity={0.7}
                        letterSpacing={2}
                        textTransform="uppercase"
                      >
                        Collection
                      </Text>
                      <Text
                        w="100%"
                        fontFamily="Montserrat"
                        textAlign="left"
                        fontSize={20}
                        fontWeight={800}
                      >
                        {collection.name}
                      </Text>
                      {collection.stats.floor_price && (
                        <Text
                          w="100%"
                          color="customBlue.500"
                          textAlign="left"
                          fontSize={17}
                          mt="xs"
                        >
                          <chakra.span
                            fontFamily="MontserratBold"
                            fontSize={15}
                            textTransform="uppercase"
                            color="black"
                          >
                            Floor price :
                          </chakra.span>
                          <br /> {collection.stats.floor_price} ETH
                        </Text>
                      )}

                      <Text
                        w="100%"
                        color="customBlue.500"
                        textAlign="left"
                        fontSize={17}
                        mt="xs"
                      >
                        <chakra.span
                          fontFamily="MontserratBold"
                          fontSize={15}
                          textTransform="uppercase"
                          color="black"
                        >
                          Total volume :
                        </chakra.span>
                        <br /> {parseInt(collection.stats.total_volume)} ETH
                      </Text>
                    </Flex>{" "}
                    <Spacer />
                    <Flex
                      flex={1}
                      align="center"
                      w="100%"
                      justify="flex-end"
                      pb="md"
                      pr="md"
                    >
                      <IconButton
                        as={Link}
                        isExternal
                        color="transparent"
                        bgColor="transparent"
                        href={
                          "https://opensea.io/collection/" + collection.slug
                        }
                        aria-label="opensea"
                        icon={<OpenseaLogo size={50} />}
                        transition="all ease 0.3s"
                        _hover={{
                          transform: "scale(1.1)",
                        }}
                      />
                    </Flex>
                  </Flex>
                  <Image
                    src={data[0].image_url || data[0].image_original_url}
                    alt={data[0].name}
                    objectFit="cover"
                    shadow="lg"
                    maxW={500}
                    borderRadius={15}
                    mx={[0, 0, 0, "sm"]}
                  />
                  <Flex
                    align="center"
                    justify="center"
                    py="md"
                    mt={["md", "md", "md", 0]}
                    flexDir="column"
                    w="100%"
                    borderRadius={15}
                    bgColor="white"
                    px="sm"
                    shadow="lg"
                  >
                    <Spacer />
                    <Text
                      w="100%"
                      fontFamily="Montserrat"
                      textAlign="left"
                      fontSize={22}
                      fontWeight={800}
                    >
                      {data[0].name}
                    </Text>
                    <Text
                      w="100%"
                      fontFamily="Montserrat"
                      textAlign="left"
                      fontSize={15}
                    >
                      Owned by{" "}
                      <Link
                        isExternal
                        color="customBlue.500"
                        href={`https://opensea.io/` + data[0].owner.address}
                      >
                        {data[0].owner.user.username ||
                          data[0].owner.address.substring(0, 6) +
                            "..." +
                            data[0].owner.address.substring(
                              data[0].owner.address.length - 4,
                              data[0].owner.address.length
                            )}
                      </Link>
                    </Text>
                    {data[0].description && (
                      <>
                        <Text
                          w="100%"
                          fontFamily="Montserrat"
                          textAlign="left"
                          fontSize={15}
                          mt="xs"
                        >
                          {data[0].description}
                        </Text>
                      </>
                    )}
                    {data[0].last_sale && (
                      <>
                        <Text
                          w="100%"
                          fontFamily="Montserrat"
                          textAlign="left"
                          fontSize={17}
                          mt="xs"
                        >
                          Last sale price :
                        </Text>
                        <Text
                          w="100%"
                          color="customBlue.500"
                          textAlign="left"
                          fontSize={17}
                        >
                          {ethers.utils.formatEther(
                            data[0].last_sale.total_price
                          )}{" "}
                          ETH{" "}
                          <chakra.span
                            fontFamily="Montserrat"
                            fontSize={15}
                            color="black"
                          >
                            {"(≈ $" +
                              (
                                parseFloat(
                                  ethers.utils.formatEther(
                                    data[0].last_sale.total_price
                                  )
                                ) * data[0].last_sale.payment_token.usd_price
                              )
                                .toString()
                                .split(".")[0] +
                              ")"}
                          </chakra.span>
                        </Text>
                        <Text
                          w="100%"
                          fontFamily="Montserrat"
                          textAlign="left"
                          fontSize={17}
                          mt="xs"
                        >
                          Stats :
                        </Text>
                        <WalletPourcentage
                          collection={[collection]}
                          nftData={data[0]}
                          isDetails
                        />
                      </>
                    )}

                    {address &&
                      data[0].owner.address === address.toLowerCase() && (
                        <>
                          <Text
                            w="100%"
                            fontFamily="MontserratBold"
                            textAlign="left"
                            textTransform="uppercase"
                            fontSize={15}
                            mt="xs"
                          >
                            Benefits :
                          </Text>

                          <Flex
                            mt="xs"
                            align="center"
                            justify="flex-start"
                            width="100%"
                          >
                            {nftData[0] ? (
                              Number(collection.stats.floor_price) -
                                Number(nftData[0].userPrice) >
                              0 ? (
                                <Icon
                                  as={AiFillCaretUp}
                                  color="green.500"
                                  w={7}
                                  h={7}
                                />
                              ) : (
                                <Icon
                                  as={AiOutlineCaretDown}
                                  color="red.500"
                                  w={7}
                                  h={7}
                                />
                              )
                            ) : (
                              <Text
                                w="50%"
                                fontFamily="Montserrat"
                                textAlign="left"
                                fontSize={15}
                              >
                                ⚠️ You must indicate the purchase price of the
                                NFT to obtain your current benefits
                              </Text>
                            )}

                            {nftData[0] ? (
                              <Text textAlign="left" fontSize={20}>
                                {(
                                  Number(collection.stats.floor_price) -
                                  Number(nftData[0].userPrice)
                                ).toFixed(2)}{" "}
                                ETH
                              </Text>
                            ) : (
                              <Text></Text>
                            )}
                          </Flex>

                          <Flex
                            align="flex-start"
                            flexDir="column"
                            justify="center"
                            w="100%"
                          >
                            <Text
                              w="100%"
                              fontFamily="MontserratBold"
                              textAlign="left"
                              textTransform="uppercase"
                              fontSize={15}
                              mt="xs"
                            >
                              Purchase price :
                            </Text>

                            {editMode ? (
                              <form onSubmit={(e) => saveNftStat(e)}>
                                <Flex align="center" justify="flex-start">
                                  <NumberInput
                                    defaultValue={0.5}
                                    precision={2}
                                    step={0.1}
                                    my="sm"
                                    maxW="50%"
                                    min={0}
                                    onChange={(valueString) =>
                                      setPriceValue(valueString)
                                    }
                                    value={priceValue}
                                  >
                                    <NumberInputField
                                      fontSize={17}
                                      required
                                      color="customBlue.500"
                                      _placeholder={{
                                        color: "customBlue.500",
                                      }}
                                      borderColor="customBlue.500"
                                    />

                                    <NumberInputStepper>
                                      <NumberIncrementStepper color="customBlue.500" />
                                      <NumberDecrementStepper color="customBlue.500" />
                                    </NumberInputStepper>
                                  </NumberInput>

                                  <Button
                                    fontSize={[12, 12, 15, 15]}
                                    px="sm"
                                    borderRadius="full"
                                    colorScheme="customBlue"
                                    _hover={{
                                      color: "white",
                                      bgColor: "customBlue.500",
                                      borderColor: "customBlue.500",
                                    }}
                                    variant="outline"
                                    shadow="md"
                                    fontWeight={400}
                                    type="submit"
                                    ml="sm"
                                  >
                                    Save
                                  </Button>
                                </Flex>
                              </form>
                            ) : (
                              <Flex mt="xs" align="center" justify="center">
                                <Text textAlign="left" fontSize={20} w="100%">
                                  {format(priceValue)}
                                </Text>{" "}
                                <IconButton
                                  aria-label="Edit"
                                  icon={<BiEdit color="#294BF5" />}
                                  ml="sm"
                                  bgColor="#ffffff"
                                  _hover={{
                                    bgColor: "#e7e7e7",
                                  }}
                                  onClick={() => setEditMode(true)}
                                />
                              </Flex>
                            )}
                          </Flex>
                        </>
                      )}
                    <Spacer />
                    <Flex align="center" w="100%" mt="xs" justify="flex-end">
                      <IconButton
                        as={Link}
                        isExternal
                        color="transparent"
                        bgColor="transparent"
                        href={data[0].permalink}
                        aria-label="opensea"
                        icon={<OpenseaLogo size={50} />}
                        transition="all ease 0.3s"
                        _hover={{
                          transform: "scale(1.1)",
                        }}
                      />
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </>
          ) : (
            <Flex
              align="center"
              justify="center"
              w="100%"
              flexDir="column"
              mt="lg"
            >
              <Text fontSize={35} color="customBlue.500" textAlign="center">
                NFT does not exist
              </Text>
            </Flex>
          )}

          <Spacer />
        </Flex>
      </Flex>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  let response = [];
  let collection = [];

  try {
    const data = await axios.get(
      `https://api.opensea.io/api/v1/assets?format=json&limit=50&offset=0&order_direction=desc`,
      {
        headers: {
          //@ts-ignore
          "X-API-KEY": process.env.OPENSEA_KEY,
        },
        params: {
          token_ids: context.query.token,
          collection_slug: context.query.collection,
        },
      }
    );
    if (data) {
      response = data.data.assets;
    }
  } catch (e) {}

  try {
    const data = await axios.get(
      `https://api.opensea.io/api/v1/collection/${context.query.collection}?format=json&limit=50&offset=0&order_direction=desc`,
      {
        headers: {
          //@ts-ignore
          "X-API-KEY": process.env.OPENSEA_KEY,
        },
      }
    );
    if (data) {
      collection = data.data.collection;
    }
  } catch (e) {}

  const nftData = await prisma.nFTData.findMany({
    where: {
      tokenId: context.query.token,
      collectionSlug: context.query.collection,
    },
  });

  return {
    props: { data: response, collection: collection, nftData },
  };
}

export default NftPage;
