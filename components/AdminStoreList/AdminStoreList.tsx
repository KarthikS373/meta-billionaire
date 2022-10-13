import { Flex } from "@chakra-ui/react";
import AdminStoreItem from "../AdminStoreItem/AdminStoreItem";

const AdminStoreList = ({
  activeProducts,
  getActiveProduct,
  raffleWinner,
}: any) => {
  return (
    <Flex align="center" justify="center" flex={1}>
      <Flex mt="md" w="100%" flexDir="column" align="center" justify="center">
        {activeProducts.map((item: any, key: number) => {
          return (
            <AdminStoreItem
              getActiveProduct={getActiveProduct}
              key={key}
              data={item}
              raffleWinner={raffleWinner}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};

export default AdminStoreList;
