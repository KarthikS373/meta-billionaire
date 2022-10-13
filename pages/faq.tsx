import {
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import React from "react";
import Layout from "../components/Layout/Layout";

const Faq = () => {
  return (
    <Layout>
      <Flex
        align="center"
        justify="flex-start"
        w="100%"
        alignItems="stretch"
        flex={1}
        px={["sm", "sm", "xl", "xl"]}
        py={["md", "md", "lg", "lg"]}
        flexDir="column"
      >
        <Flex align="center" justify="center" flexDir="column" w="100%">
          <Flex align="flex-start" justify="center" flexDir="column">
            <Text fontSize={35} color="customBlue.500">
              FAQ
            </Text>
          </Flex>
          <Accordion
            mt={["md", "md", "lg", "lg"]}
            defaultIndex={[0]}
            allowMultiple
            w="100%"
          >
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box
                    flex="1"
                    textAlign="left"
                    fontSize={20}
                    fontFamily="MontserratBold"
                  >
                    What is $MBUC ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} fontFamily="Montserrat">
                $MBUC is the Metabillionaire Utility Coin. It is the native
                currency for our digital platform offering NFT whitelists,
                merchandise, fractional shares of high-ticket NFTs, physical
                goods (coming soon), and ticketing for live events (coming
                soon). $MBUC is a cross-chain currency bridging the gap between
                Polygon and Ethereum.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box
                    flex="1"
                    textAlign="left"
                    fontSize={20}
                    fontFamily="MontserratBold"
                  >
                    How do I earn $MBUC ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} fontFamily="Montserrat">
                You must own a Metabillionaire and stake a Metabillionaire. The
                more Metabillionaires you have staked, the more $MBUC you will
                receive everyday.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box
                    flex="1"
                    textAlign="left"
                    fontSize={20}
                    fontFamily="MontserratBold"
                  >
                    Does it cost gas to stake and unstake Metabillionaires ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} fontFamily="Montserrat">
                Yes. Despite $MBUC being earned and claimed in Polygon, all
                Metabillionaires are still native to the Ethereum blockchain.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box
                    flex="1"
                    textAlign="left"
                    fontSize={20}
                    fontFamily="MontserratBold"
                  >
                    Does it cost gas to claim $MBUC ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} fontFamily="Montserrat">
                Very minimal. Claiming $MBUC requires as little as $0.01 worth
                of Polygon.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box
                    flex="1"
                    textAlign="left"
                    fontSize={20}
                    fontFamily="MontserratBold"
                  >
                    Why cross-chain ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} fontFamily="Montserrat">
                We wanted to make sure our holders can claim and spend our
                native token at very little expense - all while maintaining the
                original Metabillionaire collection native to the Ethereum
                blockchain.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box
                    flex="1"
                    textAlign="left"
                    fontSize={20}
                    fontFamily="MontserratBold"
                  >
                    How do I add $MBUC to my wallet ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} fontFamily="Montserrat">
                The token address is :
                0xECD3c4f21DcEebC8F308aF7c3A7f1A4265BB52E9. In Metamask, please
                hit import Token and place
                {' "'}0xECD3c4f21DcEebC8F308aF7c3A7f1A4265BB52E9{'"'}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Faq;
