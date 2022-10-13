import { Button, Flex, SimpleGrid, Spacer } from "@chakra-ui/react";
import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import { Text, chakra, Box } from "@chakra-ui/react";
import GraphMBUC from "../components/GraphMBUC/GraphMBUC";
import Link from "next/link";

const Stacking: NextPage = () => {
  const dashboardData = [
    { title: "MBUC EARNED LAST 24HRS", value: "42.7" },
    { title: "MBUC PRICE/USD", value: "$1.12" },
    { title: "MBUC BALANCE", value: "512.8" },
    { title: "WEEKLY EARNINGS IN $ USD", value: "$46.74" },
    { title: "MONTHLY EARNINGS IN $ USD", value: "$165.78" },
    { title: "YEARLY EARNINGS IN $ USD", value: "$1423.16" },
  ];

  return (
    <Layout>
      <Flex
        align="center"
        justify="flex-start"
        w="100%"
        alignItems="stretch"
        flex={1}
        px={["sm", "md", "lg", "lg"]}
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
            <Text fontSize={35}>
              <chakra.span color="customBlue.500">MBUC</chakra.span> EARNINGS
              DASHBOARD
            </Text>
            <Text fontFamily="Montserrat">
              See your earnings and daily yield in the MBUC dashboard.
            </Text>
          </Flex>
          <Spacer />
          <Flex align="center" justify="center" mt={["md", "md", 0, 0]}>
            <Link passHref href="/">
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
                w={[150, 150, 200, 200]}
                shadow="md"
                fontWeight={400}
              >
                BUY MBUC
              </Button>
            </Link>
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
              w={[150, 150, 200, 200]}
              shadow="md"
              fontWeight={400}
              ml={["xs", "xs", "sm", "md"]}
            >
              CLAIM MBUC
            </Button>
          </Flex>
        </Flex>
        <SimpleGrid
          columns={[1, 2, 2, 3]}
          alignItems="center"
          justifyItems="center"
          mt={["md", "md", "lg", "lg"]}
          spacing={6}
        >
          {dashboardData.map((data: any, key: number) => {
            return (
              <Box
                bgColor="#101010"
                w="100%"
                textAlign="center"
                key={key}
                borderRadius={5}
                py="60px"
                shadow="lg"
              >
                <Text fontFamily="Montserrat" fontSize={15}>
                  {data.title}
                </Text>
                <Text color="customBlue.500" mt="xs" fontSize={35}>
                  {data.value}
                </Text>
              </Box>
            );
          })}
        </SimpleGrid>
        <Flex mt="lg" w="100%" align="center" flexDir="column" justify="center">
          <Text textAlign="left" w="100%" fontSize={35} mb="lg">
            <chakra.span color="customBlue.500"> MBUC </chakra.span>PRICE/USD
          </Text>
          <GraphMBUC />
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Stacking;
