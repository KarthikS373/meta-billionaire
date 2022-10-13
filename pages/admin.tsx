import { Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import AdminContent from "../components/AdminContent/AdminContent";
import Layout from "../components/Layout/Layout";
import useEthersProvider from "../hooks/useEthersProvider";
import { join } from "path";
import matter from "gray-matter";
import fs from "fs";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../artifacts/contracts/MarketplaceERC20.sol/Marketplace.json";
import prisma from "../lib/prisma";

const Admin = ({ data, raffleWinner }: any) => {
  const [ownerContract, setOwnerContract] = useState<string>("");
  const { address, provider, chainId } = useEthersProvider();
  const toast = useToast();

  const getOwnerAddress = async () => {
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
      contractABI.abi,
      provider
    );
    try {
      const owner = await contract.getOwner();
      setOwnerContract(owner);
    } catch (err) {
      console.log("error when fetching owner on marrketplace contract");
      console.log(err);
    }
  };

  useEffect(() => {
    if (provider) {
      if (chainId === 137) {
        getOwnerAddress();
      } else {
        toast({
          description: "Please switch to Polygon network",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, [provider]);

  return (
    <Layout>
      <Flex
        align="center"
        justify="center"
        w="100%"
        alignItems="stretch"
        maxW="container.xl"
        flex={1}
        py="lg"
        px="sm"
        flexDir="column"
        m="0 auto"
      >
        {address ? (
          ownerContract ? (
            address === ownerContract ? (
              <AdminContent products={data} raffleWinner={raffleWinner} />
            ) : (
              <Text
                color="customBlue.500"
                w="100%"
                textAlign="center"
                fontSize={25}
                letterSpacing={1}
              >
                You are not admin
              </Text>
            )
          ) : (
            <Spinner m="0 auto" size="xl" mt="lg" color="customBlue.500" />
          )
        ) : (
          <Text
            color="customBlue.500"
            w="100%"
            textAlign="center"
            fontSize={25}
            letterSpacing={1}
          >
            Please connect your wallet
          </Text>
        )}
      </Flex>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // const postsDirectory = join(process.cwd(), "posts");
  // const files = fs.readdirSync(postsDirectory);
  // const posts = files.map((fileName: any) => {
  //   const slug = fileName.replace(".md", "");
  //   const postsDirectory2 = join(process.cwd(), `posts/${fileName}`);
  //   const readFile = fs.readFileSync(postsDirectory2, "utf-8");
  //   const { data: frontmatter } = matter(readFile);
  //   return {
  //     slug,
  //     frontmatter,
  //   };
  // });

  const data = await prisma.product.findMany({
    include: {
      owner: true,
    },
  });

  const raffleWinner = await prisma.raffleWinner.findMany();

  return {
    props: { data, raffleWinner },
  };
};

export default Admin;
