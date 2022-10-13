import {
  Box,
  Button,
  chakra,
  Flex,
  Image,
  Input,
  SimpleGrid,
  Spacer,
  Switch,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import useEthersProvider from "../../hooks/useEthersProvider";
import { toWeiWithDecimals } from "../../utils/helpFunctions";
import contractABI from "../../artifacts/contracts/MarketplaceERC20.sol/Marketplace.json";
import axios from "../../lib/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/router";

const AdminStoreItem = ({ data, getActiveProduct, raffleWinner }: any) => {
  const stockBigNumber = ethers.BigNumber.from(data.stock._hex);
  const stockResult = ethers.utils.formatEther(stockBigNumber);
  const finalStockResult = toWeiWithDecimals(Number(stockResult), 18);

  const startBigNumber = ethers.BigNumber.from(data.start._hex);
  const startResult = ethers.utils.formatEther(startBigNumber);
  const finalStartResult = toWeiWithDecimals(Number(startResult), 18);

  const endBigNumber = ethers.BigNumber.from(data.end._hex);
  const endResult = ethers.utils.formatEther(endBigNumber);
  const finalEndResult = toWeiWithDecimals(Number(endResult), 18);

  const priceBigNumber = ethers.BigNumber.from(data.price._hex);
  const priceResult = ethers.utils.formatEther(priceBigNumber);

  const productId = ethers.BigNumber.from(data.id._hex);
  const productIdResult = ethers.utils.formatEther(productId);
  const finalProductId = toWeiWithDecimals(Number(productIdResult), 18);

  const maxPerUserBigNumber = ethers.BigNumber.from(data.maxPerUser._hex);
  const maxPerUserResult = ethers.utils.formatEther(maxPerUserBigNumber);
  const maxPerUserFinal = toWeiWithDecimals(Number(maxPerUserResult), 18);

  const { provider, chainId } = useEthersProvider();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [productName, setProductName] = useState<string>(data.name);
  const [productImage, setProductImage] = useState<string>(data.image);
  const [productState, setProductState] = useState<boolean>(data.active);
  const [productStart, setProductStart] = useState<string>(
    finalStartResult.toString()
  );
  const [productEnd, setProductEnd] = useState<string>(
    finalEndResult.toString()
  );
  const [productWinner, setProductWinner] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [secondToken, setSecondToken] = useState<string>("");

  const [productSpot, setProductSpot] = useState<number>(finalStockResult);
  const [productPrice, setProductPrice] = useState<number>(Number(priceResult));
  const [productMaxPerUser, setProductMaxPerUser] =
    useState<number>(maxPerUserFinal);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSSR, setIsSSR] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<number>(-1);
  const toast = useToast();
  const router = useRouter();

  const updateOne = async (e: any) => {
    e.preventDefault();
    if (chainId === 137) {
      const signer = provider.getSigner();

      setIsLoading(true);

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
        contractABI.abi,
        signer
      );

      const finalProductPrice = ethers.utils.parseUnits(
        productPrice.toString(),
        18
      );

      try {
        const updateProduct = await contract.changeProduct(
          finalProductId.toFixed(0),
          productName,
          productImage,
          productState,
          productStart,
          productEnd,
          productSpot,
          finalProductPrice.toString(),
          productMaxPerUser
        );
        await updateProduct.wait();
        await getActiveProduct();
        setIsLoading(false);
        setEditMode(-1);
        toast({
          description: "Product updated successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } catch (err) {
        setIsLoading(false);
        setEditMode(-1);
        toast({
          description: "An error occured",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.log("error when fetching store content on contract");
        console.log(err);
      }
    } else {
      toast({
        description: "Please switch to Polygon network",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setIsSSR(false);
  }, []);

  useEffect(() => {
    if (productWinner === "" && raffleWinner) {
      setProductWinner(getWinnerRaffle());
    }
  }, [raffleWinner]);

  const getWinnerRaffle = () => {
    const result = raffleWinner.filter(
      (raffle: any) => Number(raffle.productId) === finalProductId
    );

    return result[0] ? result[0].winner : "Not selected yet";
  };

  const updateWinnerRaffle = async () => {
    try {
      await axios.post(`/addWinnerRaffle`, {
        token: token,
        winner: productWinner,
        productId: finalProductId,
      });

      toast({
        description: "Product updated successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        description: "An error occured",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const selectAutoWinner = async () => {
    try {
      await axios.post(`/selectAutoWinner`, {
        token: secondToken,
        productId: finalProductId,
      });

      toast({
        description: "Product updated successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      router.push("/marketplace");
    } catch (err) {
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
      updateWinnerRaffle();
    }
  }, [token]);

  useEffect(() => {
    if (secondToken) {
      selectAutoWinner();
    }
  }, [secondToken]);

  const getCaptchaToken = async (tokenType: string) => {
    if (!executeRecaptcha) {
      return;
    }
    const result = await executeRecaptcha(tokenType);
    if (result && tokenType === "updateWinnerRaffle") {
      setToken(result);
    } else if (result && tokenType === "getAutoWinner") {
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

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    const result: string = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (completed) {
      return (
        <>
          <chakra.span>Time over</chakra.span>
        </>
      );
    } else {
      return (
        <chakra.span
          fontSize={[15, 15, 18, 18]}
          color="customBlue.500"
          fontFamily="METAB"
        >
          {result}
        </chakra.span>
      );
    }
  };

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
      {editMode === finalProductId ? (
        <>
          <form style={{ width: "100%" }} onSubmit={updateOne}>
            <Button
              fontSize={15}
              size="md"
              w="100%"
              borderRadius="full"
              colorScheme="customBlue"
              shadow="md"
              textTransform="uppercase"
              fontFamily="METAB"
              onClick={() => setEditMode(-1)}
              mb="sm"
            >
              Back
            </Button>
            <Flex w="100%" align="center" flexDir="column" justify="center">
              <Text w="100%" fontSize={16} textTransform="uppercase">
                Product Name :
              </Text>
              <Input
                w="100%"
                value={productName}
                mt={2}
                required
                onChange={(e) => setProductName(e.target.value)}
                colorScheme="customBlue"
                fontSize={20}
                placeholder={data.name}
              />
            </Flex>
            <Flex
              w="100%"
              mt="sm"
              align="center"
              flexDir="column"
              justify="center"
            >
              <Text w="100%" fontSize={16} textTransform="uppercase">
                Product Image (URL) :
              </Text>
              <Input
                w="100%"
                value={productImage}
                mt={2}
                required
                onChange={(e) => setProductImage(e.target.value)}
                colorScheme="customBlue"
                fontSize={20}
                placeholder={data.image}
              />
            </Flex>
            <Flex
              w="100%"
              mt="sm"
              align="center"
              flexDir="column"
              justify="center"
            >
              <Text w="100%" fontSize={16} textTransform="uppercase">
                Product Active :
              </Text>
              <Switch
                w="100%"
                isChecked={productState}
                mt={2}
                onChange={(event) => setProductState(event.target.checked)}
                colorScheme="customBlue"
                fontSize={20}
              />
            </Flex>
            <Flex
              w="100%"
              mt="sm"
              align="center"
              flexDir="column"
              justify="center"
            >
              <Text w="100%" fontSize={16} textTransform="uppercase">
                Product Sale Start Time (Timestamp) :
              </Text>
              <Input
                w="100%"
                value={productStart}
                mt={2}
                type="number"
                required
                onChange={(e) => setProductStart(e.target.value)}
                colorScheme="customBlue"
                fontSize={20}
                placeholder="Product start sale time"
              />
            </Flex>
            <Flex
              w="100%"
              mt="sm"
              align="center"
              flexDir="column"
              justify="center"
            >
              <Text w="100%" fontSize={16} textTransform="uppercase">
                Product Sale End Time (Timestamp) :
              </Text>
              <Input
                w="100%"
                value={productEnd}
                mt={2}
                type="number"
                required
                onChange={(e) => setProductEnd(e.target.value)}
                colorScheme="customBlue"
                fontSize={20}
                placeholder="Product end sale time"
              />
            </Flex>
            <Flex
              w="100%"
              mt="sm"
              align="center"
              flexDir="column"
              justify="center"
            >
              <Text w="100%" fontSize={16} textTransform="uppercase">
                Product Quantity :
              </Text>
              <NumberInput
                w="100%"
                isRequired
                colorScheme="customBlue"
                fontSize={20}
                defaultValue={productSpot}
                min={0}
                mt={2}
                onChange={(e: any) => setProductSpot(e)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
            <Flex
              w="100%"
              mt="sm"
              align="center"
              flexDir="column"
              justify="center"
            >
              <Text w="100%" fontSize={16} textTransform="uppercase">
                Product Price in MBUC :
              </Text>
              <NumberInput
                w="100%"
                isRequired
                colorScheme="customBlue"
                fontSize={20}
                defaultValue={productPrice}
                min={0}
                mt={2}
                onChange={(e: any) => setProductPrice(e)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
            <Flex
              w="100%"
              mt="sm"
              align="center"
              flexDir="column"
              justify="center"
            >
              <Text w="100%" fontSize={16} textTransform="uppercase">
                Max product per user :
              </Text>
              <NumberInput
                w="100%"
                isRequired
                colorScheme="customBlue"
                fontSize={20}
                defaultValue={productMaxPerUser}
                min={1}
                mt={2}
                onChange={(e: any) => setProductMaxPerUser(e)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>{" "}
            <Button
              fontSize={15}
              size="md"
              w="100%"
              isLoading={isLoading}
              borderRadius="full"
              colorScheme="customBlue"
              shadow="md"
              mt="sm"
              textTransform="uppercase"
              type="submit"
              fontFamily="METAB"
            >
              Update
            </Button>
            <Flex
              w="100%"
              mt="sm"
              align="center"
              flexDir="column"
              justify="center"
            >
              <Text w="100%" fontSize={16} textTransform="uppercase">
                Winner of Raffle :
              </Text>
              <Input
                w="100%"
                value={productWinner}
                mt={2}
                onChange={(e) => setProductWinner(e.target.value)}
                colorScheme="customBlue"
                fontSize={20}
              />
              <Button
                fontSize={15}
                size="md"
                w="100%"
                isLoading={isLoading}
                borderRadius="full"
                colorScheme="customBlue"
                shadow="md"
                mt="sm"
                textTransform="uppercase"
                fontFamily="METAB"
                onClick={() => getCaptchaToken("updateWinnerRaffle")}
              >
                Update Winner
              </Button>
            </Flex>
          </form>
        </>
      ) : (
        <>
          <Image
            src={data.image}
            alt={data.name}
            objectFit="cover"
            w={200}
            h={200}
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
            <Text
              fontSize={[17, 17, 20, 20]}
              textAlign="center"
              fontFamily="METAB"
            >
              {data.name}
            </Text>
            <SimpleGrid
              justifyItems="flex-start"
              alignItems="center"
              columns={2}
              spacingX={8}
              spacingY={4}
              mt="md"
              w="100%"
            >
              <Box>
                <Text fontSize={[17, 17, 20, 20]} fontFamily="Montserrat">
                  Whitelist Spots
                </Text>
                <Text
                  fontSize={[17, 17, 20, 20]}
                  color="customBlue.500"
                  fontFamily="METAB"
                >
                  {Number(finalStockResult - 1).toFixed(0)}
                </Text>
              </Box>

              {new Date(Number(finalEndResult) * 1000).getTime() -
                new Date().getTime() <
              0 ? (
                productWinner !== "" ? (
                  <Box>
                    <Text fontSize={[17, 17, 20, 20]} fontFamily="Montserrat">
                      Winner is
                    </Text>
                    <Text
                      fontSize={[17, 17, 20, 20]}
                      color="customBlue.500"
                      fontFamily="METAB"
                    >
                      {productWinner}
                    </Text>
                  </Box>
                ) : (
                  <Button
                    fontSize={15}
                    size="md"
                    w="100%"
                    borderRadius="full"
                    colorScheme="customBlue"
                    shadow="md"
                    textTransform="uppercase"
                    fontFamily="METAB"
                    onClick={() => getCaptchaToken("getAutoWinner")}
                    my="xs"
                  >
                    Select auto winner
                  </Button>
                )
              ) : (
                Number(finalEndResult) > 0 && (
                  <Box>
                    <Text fontSize={[17, 17, 20, 20]} fontFamily="Montserrat">
                      Raffle close in
                    </Text>
                    {!isSSR && (
                      <Countdown
                        autoStart
                        date={new Date(Number(finalEndResult) * 1000)}
                        renderer={renderer}
                      />
                    )}
                  </Box>
                )
              )}

              <Box>
                <Text fontSize={[17, 17, 20, 20]} fontFamily="Montserrat">
                  Price
                </Text>
                <Text
                  fontSize={[17, 17, 20, 20]}
                  color="customBlue.500"
                  fontFamily="METAB"
                >
                  {Number(priceResult).toFixed(0)} MBUC/ticket
                </Text>
              </Box>
            </SimpleGrid>

            <Flex align="center" w="100%" justify="center" mt="md">
              <Spacer />
              <Button
                fontSize={[15, 15, 17, 17]}
                fontFamily="Montserrat"
                colorScheme="customBlue"
                w="50%"
                shadow="lg"
                onClick={() => setEditMode(finalProductId)}
              >
                Edit
              </Button>
            </Flex>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default AdminStoreItem;
