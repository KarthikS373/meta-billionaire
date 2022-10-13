import {
  Button,
  Flex,
  Spacer,
  Spinner,
  Text,
  chakra,
  TableContainer,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import useEthersProvider from "../../hooks/useEthersProvider";
import contractABI from "../../artifacts/contracts/MarketplaceERC20.sol/Marketplace.json";
import { useEffect, useState } from "react";
import CreateNewProduct from "../CreateNewProduct/CreateNewProduct";
import AdminStoreList from "../AdminStoreList/AdminStoreList";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../components/CustomTable";

const AdminContent = ({ products, raffleWinner }: any) => {
  const [activeProducts, setActiveProducts] = useState<any>(null);
  const [createNewMode, setCreateNewMode] = useState<boolean>(false);
  const [loadingName, setLoadingName] = useState<boolean>(false);
  const [productNameArray, setProductNameArray] = useState<any>(null);
  const { provider } = useEthersProvider();

  const getActiveProduct = async () => {
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

  const getProductNamePromise = async () => {
    let arrayData = [];

    for (let i = 0; i < products.length - 1; i++) {
      const contract = new ethers.Contract(
        products[i].oldContract
          ? process.env.NEXT_PUBLIC_OLD_MARKETPLACE_CONTRACT!
          : process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
        contractABI.abi,
        provider
      );

      if (typeof products[i].id === "number") {
        try {
          const getProduct = await contract.products(products[i].productId);
          arrayData[products[i].productId] = getProduct[1];
        } catch (err) {
          console.log("error when fetching name user on contract");
          console.log(err);
        }
      }
    }

    setProductNameArray(arrayData);
  };

  const getProductName = async () => {
    setLoadingName(true);
    await Promise.all([getProductNamePromise()]).then(() => {
      setLoadingName(false);
    });
  };

  useEffect(() => {
    if (provider && activeProducts === null) {
      getActiveProduct();
    }

    if (provider && productNameArray === null) {
      getProductName();
    }
  }, [provider]);

  const sortProduct = [...products].sort(
    (a, b) => Number(a.productId) - Number(b.productId)
  );

  return (
    <Flex
      align="center"
      flexDir="column"
      justify="flex-start"
      my="sm"
      px="xs"
      w="100%"
      flex={1}
    >
      <Flex align="center" justify="center" w="100%">
        <Flex align="flex-start" justify="center" flexDir="column">
          <Text fontSize={35} color="black">
            ADMIN
          </Text>
        </Flex>
        <Spacer />
      </Flex>

      <Flex
        flex={1}
        mt="md"
        align="center"
        w="100%"
        flexDir="column"
        justify="center"
      >
        {createNewMode ? (
          <CreateNewProduct setCreateNewMode={setCreateNewMode} />
        ) : (
          <>
            <Flex w="100%" align="center" justify="center">
              <Text
                fontSize={30}
                fontFamily="MontserratBold"
                textAlign="left"
                w="100%"
                color="customBlue.500"
              >
                Manage Marketplace
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
                onClick={() => setCreateNewMode(true)}
              >
                Create new product
              </Button>
            </Flex>

            {activeProducts ? (
              activeProducts.length > 0 ? (
                <AdminStoreList
                  activeProducts={activeProducts}
                  getActiveProduct={getActiveProduct}
                  raffleWinner={raffleWinner}
                />
              ) : (
                <Flex align="center" justify="center" flex={1}>
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
          </>
        )}
      </Flex>

      <Flex w="100%" align="center" mt="md" justify="center" flexDir="column">
        <Text
          fontSize={30}
          fontFamily="MontserratBold"
          textAlign="left"
          w="100%"
          color="customBlue.500"
        >
          All Buy Products
        </Text>

        <TableContainer
          overflowY="scroll"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#294BF5 #ffffff",
          }}
          maxHeight="450px"
          w="100%"
          shadow="md"
          my="md"
        >
          <Table variant="simple" colorScheme="customBlue" size="md">
            <Thead position="sticky" top={0} bgColor="#ffffff">
              <Tr>
                <Th fontFamily="Montserrat" fontSize={15}>
                  #
                </Th>
                <Th fontFamily="Montserrat" fontSize={15}>
                  Name
                </Th>
                <Th fontFamily="Montserrat" fontSize={15}>
                  Wallet
                </Th>
                <Th fontFamily="Montserrat" fontSize={15}>
                  Quantity
                </Th>
                <Th fontFamily="Montserrat" fontSize={15}>
                  Product
                </Th>
              </Tr>
            </Thead>
            <Tbody fontFamily="Montserrat" bgColor="#f7f7f7">
              {sortProduct.map((x: any, i: number) => {
                return (
                  <Tr
                    cursor="pointer"
                    transition="all ease 0.3s"
                    key={i}
                    _hover={{ bgColor: "customBlue.500", color: "white" }}
                  >
                    <Td>{i}</Td>
                    <Td>{x.owner.name}</Td>
                    <Td>{x.authorId}</Td>
                    <Td>{x.quantity}</Td>

                    <Td>
                      {loadingName ? (
                        <Spinner m="0 auto" size="md" color="customBlue.500" />
                      ) : productNameArray === null ? (
                        <Text fontSize={12}>Please connect wallet</Text>
                      ) : (
                        productNameArray[x.productId]
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Flex>
  );
};

export default AdminContent;
