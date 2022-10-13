import { Box, Text, Flex } from "@chakra-ui/react";

const Block = ({ children, title , description }: any) => {
    return (
        <Flex justify="space-between">
            <Box>
                { children }
            </Box>
            <Box p="10px">
                <Text fontWeight="400" >{ title }</Text>
                <Text
                    textAlign="left"
                    mx="auto"
                    mt="sm"
                    fontFamily="Montserrat"
                    fontSize={19}
                >{ description }</Text>
            </Box>
        </Flex>
  );
};

export default Block;
