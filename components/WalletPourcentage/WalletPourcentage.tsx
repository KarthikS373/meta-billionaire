import { chakra, Flex, Icon, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { AiFillCaretUp, AiOutlineCaretDown } from "react-icons/ai";

export const getPercentageChange = (a: number, b: number) => {
  let percent;
  if (b !== 0) {
    if (a !== 0) {
      percent = ((b - a) / a) * 100;
    } else {
      percent = b * 100;
    }
  } else {
    percent = -a * 100;
  }
  return Math.floor(percent);
};

const WalletPourcentage = ({ nftData, collection, isDetails }: any) => {
  const getCollection = (collectionSlug: string) => {
    return collection.filter(
      (collection: any) => collection.slug === collectionSlug
    )[0];
  };

  if (!nftData.last_sale) {
    return <></>;
  }

  const nftPourcentage = getPercentageChange(
    getCollection(nftData.collection.slug).stats.floor_price,
    Number(ethers.utils.formatEther(nftData.last_sale.total_price))
  );

  return (
    <Flex
      align="center"
      w={isDetails ? "100%" : "unset"}
      justify={isDetails ? "flex-start" : "center"}
      mt={1}
    >
      {nftData.last_sale && (
        <>
          {nftPourcentage > 0 ? (
            <Icon as={AiFillCaretUp} color="green.500" w={7} h={7} />
          ) : (
            <Icon as={AiOutlineCaretDown} color="red.500" w={7} h={7} />
          )}

          <Text
            color={isDetails ? "black" : "white"}
            textAlign="right"
            fontSize={15}
            ml={1}
          >
            {nftPourcentage > 0 ? "+" : "-"}{" "}
            <chakra.span fontSize={20}>{nftPourcentage}</chakra.span> %
          </Text>
        </>
      )}
    </Flex>
  );
};

export default WalletPourcentage;
