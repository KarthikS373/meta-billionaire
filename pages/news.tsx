import { Flex, Text, Spacer, SimpleGrid, Image } from "@chakra-ui/react";
import Layout from "../components/Layout/Layout";
import matter from "gray-matter";
import fs from "fs";
import { useRouter } from "next/router";
import { join } from "path";

const News = ({ posts }: any) => {
  const router = useRouter();
  return (
    <Layout>
      <Flex
        align="center"
        justify="flex-start"
        w="100%"
        alignItems="stretch"
        maxW="container.lg"
        flex={1}
        py={["md", "md", "lg", "lg"]}
        px="sm"
        flexDir="column"
        m="0 auto"
      >
        <Flex mb="md" align="center" justify="center" w="100%">
          <Flex align="flex-start" justify="center" flexDir="column">
            <Text fontSize={35} color="black">
              NEWS
            </Text>
          </Flex>
          <Spacer display={["none", "none", "flex", "flex"]} />
        </Flex>
        <SimpleGrid
          alignItems="center"
          fontFamily="Montserrat"
          justifyContent="center"
          w="100%"
          columns={[1, 1, 2, 2]}
          spacing={12}
        >
          {posts.map((postData: any, key: number) => {
            return (
              <Flex
                key={key}
                align="center"
                justify="center"
                bgColor="#ffffff"
                flexDir="column"
                shadow="xl"
                borderRadius={10}
                cursor="pointer"
                onClick={() => router.push("/news/" + postData.slug)}
                transition="all ease 0.5s"
                _hover={{ transform: "scale(1.01)" }}
              >
                <Image
                  src={"/" + postData.frontmatter.image}
                  alt={postData.frontmatter.image}
                  objectFit="cover"
                  w="100%"
                  h={200}
                  borderRadius={10}
                  shadow="xl"
                />
                <Flex py="sm" px="sm" flexDir="column">
                  <Text
                    color="customBlue.500"
                    fontFamily="OpenSans"
                    fontSize={20}
                  >
                    {postData.frontmatter.title}
                  </Text>
                  <Text
                    fontFamily="Montserrat"
                    mt="xs"
                    fontSize={15}
                    color="black"
                  >
                    {postData.frontmatter.description}
                  </Text>
                </Flex>
              </Flex>
            );
          })}
        </SimpleGrid>
      </Flex>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const postsDirectory = join(process.cwd(), "posts");
  const files = fs.readdirSync(postsDirectory);
  const posts = files.map((fileName: any) => {
    const slug = fileName.replace(".md", "");
    const postsDirectory2 = join(process.cwd(), `posts/${fileName}`);
    const readFile = fs.readFileSync(postsDirectory2, "utf-8");
    const { data: frontmatter } = matter(readFile);
    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}

export default News;
