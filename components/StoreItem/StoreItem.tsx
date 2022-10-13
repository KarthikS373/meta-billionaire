import {
  Box,
  Button,
  chakra,
  Flex,
  IconButton,
  Image,
  Input,
  Link,
  SimpleGrid,
  Spacer,
  Text,
  useNumberInput,
  useToast,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import useEthersProvider from "../../hooks/useEthersProvider";
import { toWeiWithDecimals } from "../../utils/helpFunctions";
import contractABI from "../../contracts/mbuc/MbucABI.json";
import contractMarketplaceABI from "../../artifacts/contracts/MarketplaceERC20.sol/Marketplace.json";
import axios from "../../lib/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { AiFillTwitterCircle } from "react-icons/ai";

const StoreItem = ({ data, getActiveProduct }: any) => {
  const { address, provider, chainId } = useEthersProvider();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectQuantity, setQuantity] = useState<number>(1);
  const [token, setToken] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const stockBigNumber = ethers.BigNumber.from(data.stock._hex);
  const stockResult = ethers.utils.formatEther(stockBigNumber);
  const finalStockResult = toWeiWithDecimals(Number(stockResult), 18);

  // const startBigNumber = ethers.BigNumber.from(data.start._hex);
  // const startResult = ethers.utils.formatEther(startBigNumber);
  // const finalStartResult = toWeiWithDecimals(Number(startResult), 18);

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

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max:
        maxPerUserFinal < finalStockResult ? maxPerUserFinal : finalStockResult,
      precision: 0,
      onChange: (valueAsString, valueAsNumber) => setQuantity(valueAsNumber),
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  const [isSSR, setIsSSR] = useState(true);
  const toast = useToast();

  useEffect(() => {
    setIsSSR(false);
  }, []);

  const saveInfo = async () => {
    await axios.post(`/buyProduct`, {
      address: address,
      productId: finalProductId,
      token: token,
      selectQuantity: selectQuantity,
    });
    toast({
      description: "Product bought successfully",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (token) {
      saveInfo();
    }
  }, [token]);

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    const result: string = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (completed) {
      return <chakra.span fontSize={[10,10,13,13]}>Time over</chakra.span>;
    } else {
      return (
        <chakra.span
          fontSize={[10, 10, 13, 13]}
          color="customBlue.500"
          fontFamily="METAB"
        >
          {result}
        </chakra.span>
      );
    }
  };

  const addApproval = async () => {
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_TOKEN_CONTRACT!,
      contractABI,
      signer
    );

    try {
      const approveMarketplace = await contract.approve(
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      );
      await approveMarketplace.wait();
      return true;
    } catch (err) {
      toast({
        description: "An error occured",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log("error when adding approval on contract");
      console.log(err);
      return false;
    }
  };

  const checkApproval = async () => {
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_TOKEN_CONTRACT!,
      contractABI,
      signer
    );

    try {
      const allowanceResult = await contract.allowance(
        address,
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!
      );

      const allowanceBigNumber = ethers.BigNumber.from(allowanceResult._hex);
      const allowanceFinalResult = ethers.utils.formatEther(allowanceBigNumber);
      if (Number(Number(allowanceFinalResult).toFixed(0)) > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("error when fetching allowance on MBUC contract");
      console.log(err);
      return false;
    }
  };

  const createTransaction = async () => {
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
      contractMarketplaceABI.abi,
      signer
    );

    try {
      const buyItem = await contract.buy(finalProductId, selectQuantity!);
      await buyItem.wait();
      await getActiveProduct();

      if (!executeRecaptcha) {
        return;
      }
      const result = await executeRecaptcha("buyProducts");

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
    } catch (err: any) {
      try {
        let message = JSON.parse(
          err
            .toString()
            .substring(err.toString().indexOf("{"))
            .trim()
            .replace("'", "")
            .split(", method")[0]
        );

        if (message.message.substring(19).includes("unds for gas")) {
          toast({
            description: "Not enought funds",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        } else if (message.message.includes("subtraction overflow")) {
          toast({
            description: "Not enought funds",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        } else {
          toast({
            description: message.message.substring(19),
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      } catch {
        toast({
          description: "An error occured",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }

      console.log("error when buying product on marketplace contract");
      console.log(err);
      return false;
    }
  };

  const buyProduct = async () => {
    if (address) {
      if (chainId === 137) {
        setIsLoading(true);
        if (await checkApproval()) {
          await createTransaction();
          setIsLoading(false);
        } else {
          if (await addApproval()) {
            await createTransaction();
            setIsLoading(false);
            return;
          } else {
            setIsLoading(false);
            toast({
              description: "An error occured",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
            return;
          }
        }
      } else {
        toast({
          description: "Please switch to Polygon network",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      toast({
        description: "Please connect your wallet",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const getTwitterLink = (productId: number) => {
    switch (productId) {
      // case 0:
      //   return "https://twitter.com/ragstorichienft";
      // case 1:
      //   return "https://twitter.com/snobietyclub";
      // case 2:
      //   return "https://twitter.com/flickplayapp";
      default:
        return "https://twitter.com/metab_nft";
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      maxW="350px"
      h="500px"
      w="100%"
      mx="auto"
      my="20px"
      p="20px"
      borderColor="customBlue.500"
      borderWidth={3}
      borderStyle="solid"
      bgColor="#ffffff"
      flexDir={["column", "column", "row", "row"]}
      shadow="xl"
      borderRadius={15}
    >
      <Flex
        align="center"
        justify="center"
        flexDir="column"
        w="100%"
      >
        <Flex align="center" justify="center" w="100%" flexDir="column">
          <Image
            src={data.image}
            alt={data.name}
            h={100}
            mx="auto"
            mb="7px"
            borderRadius={10}
            shadow="lg"
          />
          <Text
            fontSize={[10, 10, 13, 13]}
            textAlign="center"
            fontFamily="METAB"
          >
            {data.name}
          </Text>
          <IconButton
            as={Link}
            isExternal
            color="transparent"
            bgColor="transparent"
            href={getTwitterLink(finalProductId)}
            aria-label="opensea"
            icon={<AiFillTwitterCircle color="#294BF5" size={50} />}
            transition="all ease 0.3s"
            _hover={{
              transform: "scale(1.1)",
            }}
            mr="sm"
          />
        </Flex>
        <SimpleGrid
          justifyItems="flex-start"
          alignItems="center"
          columns={2}
          spacingX={2}
          spacingY={4}
          mt="md"
          w="100%"
        >
          <Box>
            <Text fontSize={[10, 10, 13, 13]} fontFamily="Montserrat">
              Amount Available
            </Text>
            <Text
              fontSize={[17, 17, 20, 20]}
              color="customBlue.500"
              fontFamily="METAB"
            >
              {Number(finalStockResult - 1).toFixed(0)}
            </Text>
          </Box>

          {Number(finalEndResult) > 0 && (
            <Box>
              <Text fontSize={[10, 10, 13, 13]} fontFamily="Montserrat">
                Opportunity close in
              </Text>
              {!isSSR && (
                <Countdown
                  autoStart
                  date={new Date(Number(finalEndResult) * 1000)}
                  renderer={renderer}
                />
              )}
            </Box>
          )}

          <Box>
            <Text fontSize={[10, 10, 13, 13]} fontFamily="Montserrat">
              Price
            </Text>
            <Text
              fontSize={[10, 10, 13, 13]}
              color="customBlue.500"
              fontFamily="METAB"
            >
              {Number(priceResult).toFixed(0)} MBUC/ticket
            </Text>
          </Box>

          <Box>
            <Text fontSize={[10, 10, 13, 13]} fontFamily="Montserrat">
              Max per user
            </Text>
            <Text
              fontSize={[17, 17, 20, 20]}
              color="customBlue.500"
              fontFamily="METAB"
            >
              {maxPerUserFinal}
            </Text>
          </Box>
        </SimpleGrid>

        <Flex align="center" w="100%" justify="center" mt="md">
          <Button
            color="customBlue.500"
            fontSize={[15, 15, 18, 18]}
            {...dec}
            boxShadow="none"
            bgColor="#e7e7e7"
            _hover={{
              bgColor: "#fff",
            }}
            _focus={{
              bgColor: "#fff",
            }}
          >
            -
          </Button>
          <Input
            boxShadow="none"
            fontSize={[15, 15, 18, 18]}
            w="65px"
            readOnly
            isDisabled
            type="number"
            min={1}
            max={data.wlSpot}
            _disabled={{
              opacity: 1,
            }}
            borderWidth={0}
            borderColor="transparent"
            _focus={{
              borderColor: "transparent",
            }}
            {...input}
          />
          <Button
            color="customBlue.500"
            fontSize={[15, 15, 18, 18]}
            {...inc}
            boxShadow="none"
            bgColor="#e7e7e7"
            _hover={{
              bgColor: "#fff",
            }}
            _focus={{
              bgColor: "#fff",
            }}
          >
            +
          </Button>
          <Spacer />
          {Number(finalStockResult) > 1 ? (
            <Button
              fontSize={[15, 15, 17, 17]}
              fontFamily="Montserrat"
              colorScheme="customBlue"
              w="50%"
              shadow="lg"
              onClick={() => buyProduct()}
              isLoading={isLoading}
            >
              Buy
            </Button>
          ) : (
            <Button
              fontSize={[15, 15, 17, 17]}
              fontFamily="Montserrat"
              colorScheme="customBlue"
              w="50%"
              shadow="lg"
              disabled
              isLoading={isLoading}
            >
              Sold out
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StoreItem;
