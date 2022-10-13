import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex
      align="center"
      justify="center"
      my="sm"
      px="xs"
      fontStyle="italic"
      w="100%"
    >
      <Text
        fontSize={12}
        fontWeight={100}
        fontFamily="MontserratBold"
        textAlign="center"
        color="customBlue.500"
      >
        Copyright © {new Date().getFullYear()}, All rights reserved -
        METABILLIONAIRE - made by{" "}
        <Link isExternal href="https://instagram.com/misterjuiice">
          @misterjuiice
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
