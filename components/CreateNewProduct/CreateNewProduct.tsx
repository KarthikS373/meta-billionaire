import {
  Button,
  Flex,
  Input,
  Spacer,
  Switch,
  Text,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import useEthersProvider from "../../hooks/useEthersProvider";
import contractABI from "../../artifacts/contracts/MarketplaceERC20.sol/Marketplace.json";
import { useState } from "react";

interface CreateNewProductProps {
  setCreateNewMode: (data: boolean) => void;
}

const CreateNewProduct = ({ setCreateNewMode }: CreateNewProductProps) => {
  const { provider, chainId } = useEthersProvider();
  const [productName, setProductName] = useState<string>("");
  const [productImage, setProductImage] = useState<string>("");
  const [productState, setProductState] = useState<boolean>(true);
  const [productStart, setProductStart] = useState<string>();
  const [productEnd, setProductEnd] = useState<string>();
  const [productSpot, setProductSpot] = useState<number>(10);
  const [productPrice, setProductPrice] = useState<number>();
  const [productMaxPerUser, setProductMaxPerUser] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const createNew = async (e: any) => {
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
        productPrice!.toString(),
        18
      );

      try {
        const createProduct = await contract.createProduct(
          productName,
          productImage,
          productState,
          productStart,
          productEnd,
          productSpot,
          finalProductPrice.toString(),
          productMaxPerUser
        );
        await createProduct.wait();
        setIsLoading(false);
        toast({
          description: "New product added successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } catch (err) {
        setIsLoading(false);
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

  return (
    <>
      <Flex w="100%" align="center" justify="center">
        <Text
          fontSize={30}
          fontFamily="MontserratBold"
          textAlign="left"
          w="100%"
          color="customBlue.500"
        >
          Create new product
        </Text>
        <Spacer />

        <Button
          fontSize={15}
          size="md"
          w="100%"
          borderRadius="full"
          colorScheme="customBlue"
          shadow="md"
          textTransform="uppercase"
          fontFamily="METAB"
          onClick={() => setCreateNewMode(false)}
        >
          Back to panel
        </Button>
      </Flex>

      <Flex
        fontFamily="MontserratBold"
        align="flex-start"
        justify="flex-start"
        flex={1}
        p="md"
        w="100%"
        borderWidth={3}
        borderColor="customBlue.500"
        borderRadius={15}
        mt="sm"
        flexDir="column"
      >
        <form style={{ width: "100%" }} onSubmit={createNew}>
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
              placeholder="Product name"
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
              placeholder="Product image"
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
          </Flex>
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
            Create
          </Button>
        </form>
      </Flex>
    </>
  );
};

export default CreateNewProduct;
