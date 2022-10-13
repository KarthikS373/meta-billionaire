import { Flex, Link, Text, Icon } from "@chakra-ui/react";
import {
  IoLogoDiscord,
  IoLogoTwitter,
} from "react-icons/io5";

const FooterLink = () => {
  return (
    <Flex
        bgColor="customBlue.500"
        w="100%"
        align="center"
        justify="center"
        py="md"
        px="md"
        flexDir="column"
        my="md"
        shadow="lg"
    >
        <Text
        color="white"
        textAlign="center"
        fontSize={[30, 30, 35, 35]}
        fontFamily="MontserratBold"
        >
        Join our community
        </Text>

        <Text
        textAlign="center"
        maxW="container.md"
        fontSize={[15, 15, 17, 17]}
        fontFamily="Montserrat"
        mt="sm"
        color="white"
        >
        Chat with the team and others in the community to learn more about
        MBUC and help shape the future of the platform.
        </Text>

        <Flex>
        <Flex
            w="100%"
            as={Link}
            isExternal
            href="https://discord.gg/metabillionaire"
            align="center"
            justify="center"
            bgColor="#ffffff"
            flexDir="column"
            py="sm"
            px="sm"
            mx="20px"
            my="5px"
            borderRadius={10}
            cursor="pointer"
            transition="all ease 0.5s"
            _hover={{
            transform: "scale(1.05)",
            }}
            shadow="lg"
        >
            <Icon as={IoLogoDiscord} color="customBlue.500" w={42} h={42} />
        </Flex>
        <Flex
            w="100%"
            align="center"
            as={Link}
            isExternal
            href="https://twitter.com/metab_nft"
            justify="center"
            bgColor="#ffffff"
            flexDir="column"
            py="sm"
            px="sm"
            mx="20px"
            my="5px"
            borderRadius={10}
            cursor="pointer"
            transition="all ease 0.5s"
            _hover={{
            transform: "scale(1.05)",
            }}
            shadow="lg"
        >
            <Icon as={IoLogoTwitter} color="customBlue.500" w={42} h={42} />
        </Flex>
        </Flex>
    </Flex>
  );
};

export default FooterLink;
