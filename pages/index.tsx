import {
  Text,
  Flex,
  Image,
  chakra,
  Spinner,
  SimpleGrid,
  Button,
  Spacer,
  Icon,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { BiWallet } from "react-icons/bi";
import Layout from "../components/Layout/Layout";
import useEthersProvider from "../hooks/useEthersProvider";
import prisma from "../lib/prisma";
import { join } from "path";
import fs from "fs";
import matter from "gray-matter";
import {
  IoHourglassOutline,
} from "react-icons/io5";
import FooterLink from "../components/Footer/FooterLink";
import { useRouter } from "next/router";
import StoreItem from "../components/StoreItem/StoreItem";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../artifacts/contracts/MarketplaceERC20.sol/Marketplace.json";

const Home: NextPage = ({ investments, news }: any) => {
  const { connect, address } = useEthersProvider();
  const router = useRouter();
  const [activeProducts, setActiveProducts] = useState<any>(null);

  const getActiveProduct = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_POLYGON_API_KEY
    );
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
      contractABI.abi,
      provider
    );
    try {
      const getProduct = await contract.getActiveProducts();
      setActiveProducts(getProduct);
    } catch (err) {
      console.log("error when fetching store content on contract");
      console.log(err);
    }
  };

  useEffect(() => {
    getActiveProduct();
  }, []);

  const fractionalData = [
    {
      title: "Accessibility",
      description:
        "Become a partial owner of collectable NFTs you otherwise could not afford.",
    },
    {
      title: "Freedom",
      description:
        "Decide what to do with your NFT fractions (e.g., add the underlying NFT to a digital gallery, deliver to contest winners).",
    },
    {
      title: "Creativity",
      description:
        "Choose from a variety of iconic digital art collections composed of one or more NFTs.",
    },
    {
      title: "Diversity",
      description:
        "Deliver imaginative distribution events and novel post-purchase community experiences for your fraction owners.",
    },
  ];

  return (
    <Layout>
      <Flex w="100%" flexDir="column" align="center" justify="center" pos="relative">
        <Flex
          mb="md"
          w="100%"
          flexDir="column"
          align="center"
          justify="center"
          bgColor="#2046E7"
          display={["none", "none", "flex", "flex"]}
        >
          <Image
            pos="relative"
            src="/banner.png"
            alt="metabillionaire"
            w={["100%", "100%%", "45%", "45%"]}
            h="100%"
            objectFit="cover"
          />
          <Text
            pos="absolute"
            m="sm"
            top="0px"
            color="white"
          >
            WELCOME TO OUR PLATFORM
          </Text>
        </Flex>
        <Flex
          w="100%"
          flexDir="column"
          align="center"
          justify="center"
          mt={["md", "md", "sm", "sm"]}
          px="sm"
        >
          <Text
            fontFamily="MontserratBold"
            textAlign="center"
            fontSize={[28, 28, 30, 35]}
          >
            <chakra.span color="customBlue.500">Collective</chakra.span>{" "}
            ownership of iconic and historic NFTs
          </Text>

          <Text
            my="sm"
            fontFamily="Montserrat"
            textAlign="center"
            fontSize={17}
          >
            Fractionalization is also a unique way to unlock NFT liquidity and
            community building around popular NFTs.
          </Text>

          <Image
            src="/fractional.png"
            alt="fractional nft"
            objectFit="cover"
            w="100%"
            maxW={400}
            mt="md"
          />

          <SimpleGrid
            maxW="container.lg"
            columns={[1, 1, 2, 2]}
            spacing={12}
            alignItems="center"
            my="lg"
            justifyItems="center"
          >
            {fractionalData.map((fractionData: any, key: number) => {
              return (
                <Flex
                  flexDir="column"
                  align="center"
                  justify="center"
                  w="100%"
                  key={key}
                >
                  <Text
                    textAlign="left"
                    w="100%"
                    fontFamily="MontserratBold"
                    fontSize={25}
                  >
                    {fractionData.title}
                  </Text>

                  <Text
                    textAlign="left"
                    mt="sm"
                    w="100%"
                    fontFamily="Montserrat"
                    fontSize={20}
                  >
                    {fractionData.description}
                  </Text>
                </Flex>
              );
            })}
          </SimpleGrid>

          {!address && (
            <Flex w="100%" align="center" justify="center" mb="md">
              <Button
                fontSize={[15, 15, 17, 17]}
                px="md"
                py={6}
                borderRadius="full"
                colorScheme="customBlue"
                shadow="lg"
                leftIcon={<BiWallet size={20} />}
                fontFamily="MontserratBold"
                onClick={() => connect()}
                mr="sm"
              >
                Connect wallet to start
              </Button>
            </Flex>
          )}
          {/*<Text*/}
          {/*  maxW="container.lg"*/}
          {/*  fontSize={30}*/}
          {/*  w="100%"*/}
          {/*  textAlign="left"*/}
          {/*  textTransform="uppercase"*/}
          {/*  mt="lg"*/}
          {/*  mb="md"*/}
          {/*>*/}
          {/*  Live Fractions*/}
          {/*</Text>*/}

          {/*<SimpleGrid*/}
          {/*  maxW="container.lg"*/}
          {/*  columns={[1, 1, 2, 2]}*/}
          {/*  alignItems="center"*/}
          {/*  justifyItems="center"*/}
          {/*  spacing={6}*/}
          {/*  w="100%"*/}
          {/*  m="0 auto"*/}
          {/*>*/}
          {/*  {investments.map((investmentsData: any, key: number) => {*/}
          {/*    return (*/}
          {/*      <Flex*/}
          {/*        bgColor="#171717"*/}
          {/*        w="100%"*/}
          {/*        minH={450}*/}
          {/*        textAlign="center"*/}
          {/*        key={key}*/}
          {/*        pt="sm"*/}
          {/*        pb="xs"*/}
          {/*        bg={`url(${investmentsData.image}) no-repeat center center`}*/}
          {/*        bgRepeat="no-repeat"*/}
          {/*        bgSize="cover"*/}
          {/*        align={investmentsData.comingSoon ? "center" : "flex-end"}*/}
          {/*        justify="center"*/}
          {/*        px="sm"*/}
          {/*        shadow="md"*/}
          {/*        borderRadius={15}*/}
          {/*        cursor="pointer"*/}
          {/*        transition="all ease 0.5s"*/}
          {/*        _hover={{*/}
          {/*          transform: "scale(1.01)",*/}
          {/*        }}*/}
          {/*        boxShadow={`inset 0px ${*/}
          {/*          investmentsData.comingSoon ? "-550px" : "-145px"*/}
          {/*        } 15px 2px rgba(0,0,0,${*/}
          {/*          investmentsData.comingSoon ? "0.9" : "0.8"*/}
          {/*        })`}*/}
          {/*        onClick={() =>*/}
          {/*          investmentsData.comingSoon*/}
          {/*            ? {}*/}
          {/*            : router.push("/vault/" + investmentsData.id)*/}
          {/*        }*/}
          {/*      >*/}
          {/*        {!investmentsData.comingSoon ? (*/}
          {/*          <>*/}
          {/*            <Flex*/}
          {/*              flexDir="column"*/}
          {/*              align="flex-start"*/}
          {/*              justify="flex-start"*/}
          {/*            >*/}
          {/*              <Text textAlign="left" fontSize={20} color="white">*/}
          {/*                <chakra.span color="customBlue.500">*/}
          {/*                  {investmentsData.supply * 10}%*/}
          {/*                </chakra.span>{" "}*/}
          {/*                Available*/}
          {/*              </Text>*/}
          {/*            </Flex>*/}
          {/*            <Spacer />*/}
          {/*            <Flex*/}
          {/*              w="100%"*/}
          {/*              flexDir="column"*/}
          {/*              align="flex-end"*/}
          {/*              justify="center"*/}
          {/*            >*/}
          {/*              <Text color="white" textAlign="right" fontSize={15}>*/}
          {/*                {investmentsData.title}*/}
          {/*              </Text>*/}
          {/*              <Text*/}
          {/*                color="customBlue.500"*/}
          {/*                textAlign="right"*/}
          {/*                fontSize={17}*/}
          {/*              >*/}
          {/*                {investmentsData.tokenId}*/}
          {/*              </Text>*/}
          {/*              <Text*/}
          {/*                textTransform="uppercase"*/}
          {/*                fontFamily="OpenSans"*/}
          {/*                fontSize={12}*/}
          {/*                color="white"*/}
          {/*                mt={1}*/}
          {/*              >*/}
          {/*                Valued{" "}*/}
          {/*                <chakra.span ml={1} fontSize={17} lineHeight={5}>*/}
          {/*                  {investmentsData.totalPrice} ETH*/}
          {/*                </chakra.span>*/}
          {/*              </Text>*/}
          {/*              <Text*/}
          {/*                textTransform="uppercase"*/}
          {/*                fontFamily="OpenSans"*/}
          {/*                fontSize={12}*/}
          {/*                color="white"*/}
          {/*              >*/}
          {/*                Price{" "}*/}
          {/*                <chakra.span ml={1} fontSize={17} lineHeight={5}>*/}
          {/*                  {investmentsData.stackingPrice} ETH*/}
          {/*                </chakra.span>*/}
          {/*              </Text>*/}
          {/*              <Text*/}
          {/*                textTransform="uppercase"*/}
          {/*                fontFamily="OpenSans"*/}
          {/*                fontSize={12}*/}
          {/*                color="white"*/}
          {/*              >*/}
          {/*                Supply{" "}*/}
          {/*                <chakra.span ml={1} fontSize={17} lineHeight={5}>*/}
          {/*                  {investmentsData.supply}/*/}
          {/*                  {investmentsData.totalSupply}*/}
          {/*                </chakra.span>*/}
          {/*              </Text>*/}
          {/*            </Flex>*/}
          {/*          </>*/}
          {/*        ) : (*/}
          {/*          <>*/}
          {/*            <Flex flexDir="column" align="center" justify="center">*/}
          {/*              <Flex*/}
          {/*                bgColor="customBlue.500"*/}
          {/*                borderRadius="full"*/}
          {/*                w={75}*/}
          {/*                h={75}*/}
          {/*                flexDir="column"*/}
          {/*                align="center"*/}
          {/*                justify="center"*/}
          {/*              >*/}
          {/*                <Icon*/}
          {/*                  as={IoHourglassOutline}*/}
          {/*                  w={35}*/}
          {/*                  h={35}*/}
          {/*                  color="white"*/}
          {/*                />*/}
          {/*              </Flex>*/}
          {/*              <Text*/}
          {/*                textTransform="uppercase"*/}
          {/*                fontSize={30}*/}
          {/*                mt="xs"*/}
          {/*                color="customBlue.500"*/}
          {/*              >*/}
          {/*                Coming soon*/}
          {/*              </Text>*/}
          {/*            </Flex>*/}
          {/*          </>*/}
          {/*        )}*/}
          {/*      </Flex>*/}
          {/*    );*/}
          {/*  })}*/}
          {/*</SimpleGrid>*/}

          <Text
            fontSize={30}
            w="100%"
            textAlign="center"
            textTransform="uppercase"
            mt="lg"
            mb="md"
          >
            SHOP
          </Text>

          <Flex flexWrap="wrap">
          {activeProducts ? (
            activeProducts.length > 0 ? (
              activeProducts.map((product: any, key: number) => {
                return (
                    <StoreItem
                      key={key}
                      data={product}
                      getActiveProduct={getActiveProduct}
                    />
                );
              })
            ) : (
              <Flex align="center" justify="center" flexWrap="wrap">
                <Text
                  fontSize={25}
                  fontFamily="MontserratBold"
                  color="customBlue.500"
                  textAlign="center"
                >
                  There is no active product
                  <br /> on Marketplace actually
                </Text>
              </Flex>
            )
          ) : (
            <Spinner m="0 auto" size="xl" mt="lg" color="customBlue.500" />
          )}
          </Flex>
          <Text
            fontSize={30}
            w="100%"
            textAlign="left"
            textTransform="uppercase"
            mt="lg"
            mb="md"
          >
            NEWS
          </Text>

          <SimpleGrid
            fontFamily="Montserrat"
            justifyContent="center"
            w="100%"
            columns={[1, 1, 2, 3]}
            spacing={12}
            mb="md"
            alignItems="stretch"
          >
            {news.map((postData: any, key: number) => {
              return (
                <Flex
                  key={key}
                  align="center"
                  justify="center"
                  bgColor="#ffffff"
                  flexDir="column"
                  shadow="xl"
                  borderRadius={10}
                  cursor="pointer"
                  w="100%"
                  onClick={() =>
                    router.push("/news/" + postData.slug, undefined, {
                      scroll: false,
                    })
                  }
                  transition="all ease 0.5s"
                  _hover={{ transform: "scale(1.01)" }}
                >
                  <Image
                    src={"/" + postData.frontmatter.image}
                    alt={postData.frontmatter.image}
                    objectFit="cover"
                    w="100%"
                    h={200}
                    borderRadius={10}
                    shadow="xl"
                  />
                  <Flex py="sm" flex={1} px="sm" w="100%" flexDir="column">
                    <Text
                      color="customBlue.500"
                      fontFamily="OpenSans"
                      fontSize={20}
                    >
                      {postData.frontmatter.title}
                    </Text>
                    <Text
                      fontFamily="Montserrat"
                      mt="xs"
                      fontSize={15}
                      color="black"
                    >
                      {postData.frontmatter.description}
                    </Text>
                  </Flex>
                </Flex>
              );
            })}
          </SimpleGrid>
        </Flex>
        <FooterLink />
      </Flex>
    </Layout>
  );
};

export async function getServerSideProps() {
  const investments = await prisma.nFT.findMany();

  const postsDirectory = join(process.cwd(), "posts");
  const files = fs.readdirSync(postsDirectory);
  const news = files.map((fileName: any) => {
    const slug = fileName.replace(".md", "");
    const postsDirectory2 = join(process.cwd(), `posts/${fileName}`);
    const readFile = fs.readFileSync(postsDirectory2, "utf-8");
    const { data: frontmatter } = matter(readFile);
    return {
      slug,
      frontmatter,
    };
  });

  return { props: { investments, news } };
}

export default Home;
