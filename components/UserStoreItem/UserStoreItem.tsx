import {
  Box,
  Button,
  Flex,
  Image,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useEthersProvider from "../../hooks/useEthersProvider";
import { toWeiWithDecimals } from "../../utils/helpFunctions";
import contractMarketplaceABI from "../../artifacts/contracts/MarketplaceERC20.sol/Marketplace.json";
import { Product } from "@prisma/client";
import axios from "../../lib/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const UserStoreItem = ({ data, userProduct, getUserData }: any) => {
  const { address, provider } = useEthersProvider();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [selectQuantity, setQuantity] = useState<number>(1);
  const [token, setToken] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const toast = useToast();

  const productId = ethers.BigNumber.from(data.id._hex);
  const productIdResult = ethers.utils.formatEther(productId);
  const finalProductId = toWeiWithDecimals(Number(productIdResult), 18);

  const getProductCount = async () => {
    setIsLoading(true);

    const fetchClaim = userProduct.filter(
      (product: Product) =>
        Number(product.productId) === finalProductId &&
        product.alreadyClaim === false
    );

    if (fetchClaim.length > 0) {
      setCanClaim(true);
    } else {
      setCanClaim(false);
    }

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
      contractMarketplaceABI.abi,
      provider
    );
    try {
      const getProduct = await contract.getUserStockOwned(
        address,
        finalProductId
      );

      const productBigNumber = ethers.BigNumber.from(getProduct._hex);
      const resultProduct = ethers.utils.formatEther(productBigNumber);
      const finalResultProduct = toWeiWithDecimals(Number(resultProduct), 18);

      setQuantity(finalResultProduct);
      setIsLoading(false);
    } catch (err) {
      console.log("error when fetching store content on contract");
      console.log(err);
      setIsLoading(false);
    }
  };

  const refreshClaimStatus = async () => {
    await getProductCount();
  };

  useEffect(() => {
    refreshClaimStatus();
  }, [userProduct]);

  const saveInfo = async () => {
    const { data } = await axios.post(`/claimProduct`, {
      address: address,
      productId: finalProductId,
      token: token,
    });

    if (data.data.alreadyClaim) {
      setIsLoading(false);
      await getUserData();
      await getProductCount;
      toast({
        description: "Product Claimed Successfully !",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setIsLoading(false);

      toast({
        description: "An error occured",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (token) {
      saveInfo();
    }
  }, [token]);

  const claimProduct = async () => {
    setIsLoading(true);

    if (!executeRecaptcha) {
      setIsLoading(false);
      toast({
        description:
          "An error occured with the robots verification, please try again...",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    const result = await executeRecaptcha("claimProducts");
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

    // afficher formulaire avec adresses et info de livraison et la save en bdd
  };

  useEffect(() => {
    getProductCount();
  }, []);

  return (
    <Flex
      align="center"
      justify="center"
      w="100%"
      px={["sm", "sm", "lg", "lg"]}
      mb="md"
      py="md"
      borderColor="customBlue.500"
      borderWidth={3}
      borderStyle="solid"
      bgColor="#ffffff"
      flexDir={["column", "column", "row", "row"]}
      shadow="xl"
      borderRadius={15}
    >
      <Image
        src={data.image}
        alt={data.name}
        objectFit="cover"
        w={200}
        h={250}
        borderRadius={10}
        shadow="lg"
      />
      <Flex
        align="center"
        justify="center"
        flexDir="column"
        ml={[0, 0, "lg", "lg"]}
        mt={["md", "md", 0, 0]}
        w="100%"
      >
        <Text fontSize={[17, 17, 20, 25]} textAlign="center" fontFamily="METAB">
          {data.name}
        </Text>
        <Spacer />
        <Flex align="center" mt="lg" justify="center" w="100%">
          <Box w="100%">
            <Text fontSize={[17, 17, 20, 20]} fontFamily="Montserrat">
              You own
            </Text>
            <Text
              fontSize={[17, 17, 20, 20]}
              color="customBlue.500"
              fontFamily="METAB"
            >
              {selectQuantity} item{selectQuantity > 1 && "s"}
            </Text>
          </Box>

          <Box w="100%">
            <Button
              fontSize={[15, 15, 17, 17]}
              fontFamily="Montserrat"
              colorScheme="customBlue"
              w="100%"
              shadow="lg"
              disabled={!canClaim}
              isLoading={isLoading}
              onClick={() => claimProduct()}
            >
              {!canClaim ? "Already Claim" : "Claim"}
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserStoreItem;
