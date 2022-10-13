import { Box, Flex, Text } from "@chakra-ui/react";
import matter from "gray-matter";
import fs from "fs";
import md from "markdown-it";
import Layout from "../../components/Layout/Layout";
import { join } from "path";

const NewsContent = ({ frontmatter, content }: any) => {
  return (
    <Layout>
      <Flex
        my={["md", "md", "lg", "lg"]}
        align="center"
        justify="center"
        w="100%"
        flexDir="column"
        px="md"
        maxW="container.md"
        m="0 auto"
      >
        <Text
          mb="sm"
          mt={["md", "md", 0, 0]}
          fontSize={[22, 22, 25, 25]}
          textAlign="center"
          fontFamily="MontserratBold"
        >
          {frontmatter.title}
        </Text>
        <Text mb="sm" fontSize={17} fontFamily="OpenSans">
          {frontmatter.date}
        </Text>
        <Box
          className="prose mx-auto article-content"
          fontFamily="Montserrat"
          dangerouslySetInnerHTML={{ __html: md().render(content) }}
          mb="md"
        />
      </Flex>
    </Layout>
  );
};

export async function getStaticProps({ params: { slug } }: any) {
  const postsDirectory = join(process.cwd(), `posts/${slug}.md`);
  const fileName = fs.readFileSync(postsDirectory, "utf-8");
  const { data: frontmatter, content } = matter(fileName);

  return {
    props: {
      frontmatter,
      content,
    },
  };
}

export async function getStaticPaths() {
  const postsDirectory = join(process.cwd(), "posts");
  const files = fs.readdirSync(postsDirectory);

  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default NewsContent;
