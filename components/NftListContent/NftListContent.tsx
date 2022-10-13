import { Button, Flex, Icon, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdOutlineError } from "react-icons/md";

const NftListContent = ({ userData, setCursorPage, isLoading }: any) => {
  const router = useRouter();

  return (
    <>
      <SimpleGrid
        columns={userData.data.assets.length > 0 ? [1, 2, 3, 5] : 1}
        alignItems="stretch"
        justifyContent="center"
        spacing={6}
        mt="lg"
        w="100%"
      >
        {userData.data.assets.length > 0 ? (
          <>
            {userData.data.assets.map((nftData: any, key: number) => {
              return (
                <Flex
                  bgColor="#171717"
                  w="100%"
                  h={[350, 350, 450, 450]}
                  objectFit="cover"
                  textAlign="center"
                  key={key}
                  pt="sm"
                  pb="xs"
                  bg={`url(${
                    nftData.image_url ||
                    nftData.image_original_url ||
                    nftData.collection.large_image_url
                  }) no-repeat center center`}
                  bgRepeat="no-repeat"
                  bgSize="cover"
                  align="flex-end"
                  justify="center"
                  position="relative"
                  px="sm"
                  onClick={() =>
                    router.push(
                      "/nft/" + nftData.collection.slug + "/" + nftData.token_id
                    )
                  }
                  shadow="lg"
                  borderRadius={15}
                  cursor="pointer"
                  transition="all ease 0.5s"
                  _hover={{
                    transform: "scale(1.01)",
                    boxShadow: "inset 0px -130px 15px 2px rgba(0,0,0,0.90)",
                  }}
                  boxShadow="inset 0px -130px 15px 2px rgba(0,0,0,0.80)"
                >
                  {nftData.image_url && nftData.image_url.includes(".bin") && (
                    <Flex
                      w="100%"
                      flexDir="column"
                      align="flex-end"
                      justify="center"
                      position="absolute"
                      textAlign="center"
                      top={16}
                      left={0}
                      right={0}
                    >
                      <Icon
                        as={MdOutlineError}
                        color="red.500"
                        w={14}
                        h={14}
                        m="0 auto"
                      />
                      <Text
                        w="100%"
                        color="black"
                        textAlign="center"
                        fontSize={17}
                        fontWeight={800}
                        mt="xs"
                      >
                        Content not available
                      </Text>
                    </Flex>
                  )}

                  <Spacer />
                  <Flex
                    w="100%"
                    flexDir="column"
                    align="flex-end"
                    justify="center"
                  >
                    {nftData.name ? (
                      nftData.name.includes("#") ? (
                        <>
                          <Text
                            w="100%"
                            color="white"
                            textAlign="right"
                            fontSize={15}
                          >
                            {nftData.name.split("#")[0]}
                          </Text>
                          <Text
                            color="customBlue.500"
                            textAlign="right"
                            fontSize={15}
                          >
                            #{nftData.name.split("#")[1]}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text color="white" textAlign="right" fontSize={15}>
                            {nftData.name}
                          </Text>
                          <Text
                            color="customBlue.500"
                            textAlign="right"
                            fontSize={15}
                          >
                            #{nftData.token_id.substring(0, 5)}
                            {nftData.token_id.length > 5 && "..."}
                          </Text>
                        </>
                      )
                    ) : (
                      <>
                        <Text
                          w="100%"
                          color="white"
                          textAlign="right"
                          fontSize={15}
                        >
                          {nftData.collection.name}
                        </Text>
                        <Text
                          color="customBlue.500"
                          textAlign="right"
                          fontSize={15}
                        >
                          #{nftData.token_id}
                        </Text>
                      </>
                    )}
                  </Flex>
                </Flex>
              );
            })}
          </>
        ) : (
          <Text
            w="100%"
            textAlign="center"
            fontFamily="Montserrat"
            fontSize={25}
            color="customBlue.500"
            mb="md"
          >
            You don{"'"}t have NFT
          </Text>
        )}
      </SimpleGrid>

      {userData.data.assets.length > 0 && (
        <Flex mt="md" w="100%" align="center" justify="center">
          <Button
            fontSize={20}
            size="lg"
            borderRadius={5}
            colorScheme="customBlue"
            shadow="md"
            textTransform="uppercase"
            isLoading={isLoading}
            fontFamily="METAB"
            isDisabled={userData.data.previous === null}
            onClick={() => {
              if (userData.data.previous) {
                setCursorPage(userData.data.previous);
              }
            }}
          >
            Back
          </Button>
          <Spacer />
          <Button
            fontSize={20}
            size="lg"
            borderRadius={5}
            colorScheme="customBlue"
            shadow="md"
            textTransform="uppercase"
            isLoading={isLoading}
            fontFamily="METAB"
            isDisabled={userData.data.next === null}
            onClick={() => {
              if (userData.data.next) {
                setCursorPage(userData.data.next);
              }
            }}
          >
            Next
          </Button>
        </Flex>
      )}
    </>
  );
};

export default NftListContent;
