import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  SimpleGrid,
  Spacer,
  Text,
  useNumberInput,
} from "@chakra-ui/react";
import { NFT } from "@prisma/client";

interface InvestmentItemProps {
  data: NFT;
}

const InvestmentItem = ({ data }: InvestmentItemProps) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: data.supply,
      precision: 0,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input: any = getInputProps();

  return (
    <Flex
      align="center"
      justify="center"
      w="100%"
      px={["sm", "sm", "lg", "lg"]}
      my="md"
      py="md"
      bgColor="#e7e7e7"
      flexDir={["column", "column", "row", "row"]}
      shadow="lg"
      borderRadius={15}
    >
      <Image
        src={data.image}
        alt={data.title}
        objectFit="cover"
        maxW={250}
        borderRadius={20}
        shadow="lg"
      />
      <Flex
        align="center"
        justify="center"
        flexDir="column"
        ml={[0, 0, "lg", "lg"]}
        mt={["md", "md", 0, 0]}
      >
        <SimpleGrid
          justifyItems="flex-start"
          alignItems="center"
          columns={2}
          spacingX={12}
          spacingY={4}
          mt="md"
        >
          <Box>
            <Text fontSize={[15, 15, 17, 17]} fontFamily="Montserrat">
              Remaining supply
            </Text>
            <Text
              fontSize={[15, 15, 17, 17]}
              color="customBlue.500"
              fontFamily="METAB"
            >
              {data.supply}/{data.totalSupply}
            </Text>
          </Box>
          <Box>
            <Text fontSize={[15, 15, 17, 17]} fontFamily="Montserrat">
              You Pay
            </Text>
            <Text
              fontSize={[15, 15, 17, 17]}
              color="customBlue.500"
              fontFamily="METAB"
            >
              {(data.stackingPrice * parseInt(input.value)).toFixed(2)} MBUC
            </Text>
          </Box>
          <Box>
            <Text fontSize={[15, 15, 17, 17]} fontFamily="Montserrat">
              Price
            </Text>
            <Text
              fontSize={[15, 15, 17, 17]}
              color="customBlue.500"
              fontFamily="METAB"
            >
              {data.stackingPrice} MBUC/10%
            </Text>
          </Box>
          <Box>
            <Text fontSize={[15, 15, 17, 17]} fontFamily="Montserrat">
              Pourcentage
            </Text>
            <Text
              fontSize={[15, 15, 17, 17]}
              color="customBlue.500"
              fontFamily="METAB"
            >
              You get {input.value * 10}% of the NFT
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
            userSelect="none"
            min={1}
            max={data.supply}
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
          <Button
            fontSize={[15, 15, 17, 17]}
            fontFamily="Montserrat"
            colorScheme="customBlue"
            w="50%"
            shadow="lg"
          >
            Invest
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default InvestmentItem;
