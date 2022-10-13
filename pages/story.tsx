import Layout from "../components/Layout/Layout";
import { Text } from "@chakra-ui/react";
import FooterLink from "../components/Footer/FooterLink";

const StoryPage = () => {
  return (
    <Layout>
        <Text
            fontSize={30}
            w="80%"
            textAlign="center"
            textTransform="uppercase"
            mx="auto"
            mt="lg"
            mb="md"
        >
            Story
        </Text>
        <Text
            textAlign="left"
            w="80%"
            mx="auto"
            mt="sm"
            fontFamily="Montserrat"
            fontSize={19}
        >
            The year was 2021. The world was just starting to feel “normal” again as society was slowly absorbing the blow of COVID - 19. Stephen Curry had bought a Bored Ape Yacht Club NFT and the rest of the mainstream world was poised to follow.Amongst this chaos, three innovators came together to discuss the state of Web3 and how they could claim their piece of it.The trio consisted of:<br />
            <br/>
            <Text fontWeight={1000}>Robotom(Thomas)</Text><br />
            a level - headed ecommerce wunderkind who built a brand that was able to license his phone case to the largest football clubs in the world.He would become the business head of the new NFT project.<br />
            <br/>
            <Text fontWeight={1000}>Moneymaker(Nathan)</Text><br />
            an enthusiastic hustler who built himself from a penniless orphan surviving from scraps on the streets of Paris into the innovative entrepreneur living high above the bright lights of Dubai.He would become the creative spark that fueled the NFT project’s vision.<br />
            <br/>
            <Text fontWeight={1000}>OldKid(Camille)</Text><br />
            nobody knows where he came from or where he’s been…only that somehow, somewhere along the way he had built up his network to reach deep into the international athletic inner circles of professional sports.He would become the marketing lead for this blossoming NFT project.<br /><br />
            Together these three young entrepreneurs discovered a master 3D artist on TikTok named Kashama and enticed him with the promise of millions of dollars in the event of a successful mint of their NFT project.With this new four - man team in place, they set to work.<br /><br />
            They envisioned the next Crypto Punks - an instantly recognizable and iconic piece of art that was an innovative step deeper into Web3.<br /><br />
            They envisioned the next Bored Ape Yacht Club - a community of well very intelligent experts of their fields that utilized its network to push one another to new heights.<br /><br />
            They envisioned Metabillionaire.<br /><br />
            As Kashama worked tirelessly to create the traits and handpick the most aesthetically pleasing combinations that would capture the imagination of the Web3 world, the rest of the team began building.Moneymaker created a grand roadmap for the project drawn from countless hours of market analysis, which included components of charitable contributions, metaverse land development, merchandise drops, an entrepreneur - centered community, and mastermind podcasts from successful business owners the world over.OldKid went deep into his vast network to secure deals with strategically chosen NFT influencers, marketers, and celebrities such as Hannah Stocking, Rudy Gobert, Jordan Clarkson, and Tyga for them to reach the specific niche that the founders felt would most resonate with Metabillionaire’s brand.Robotom oversaw operations and carefully calculated the exorbitant cost of Moneymaker’s ambitious roadmap, OldKid’s high - profile celebrity deals, and Kashama’s countless hours of perfecting Metabillionaire’s aesthetic.With the project nearly ready for launch, and the heavy $1.5 million expense the project was projected to incur, the founders opened up their Discord community to a flood of tens of thousands of people, eager to mint and become Metabillionaires.The hype and buzz over the project completely exceeded the expectations of the founders and they augmented it with random Ethereum giveaways in chat and the prized Whitelist role handed out to the most active and valuable community members by the founders and their newly appointed mods.<br /><br />
        </Text>
        <FooterLink />
    </Layout>
  );
};

export default StoryPage;
