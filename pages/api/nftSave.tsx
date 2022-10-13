import prisma from "../../lib/prisma";
import protectAPI from "../../middleware/protectAPI";
import { utils } from "ethers";
import request from "request";

async function handler(req: any, res: any) {
  return new Promise((resolve: any) => {
    const { tokenId, address, collectionSlug, userPrice, token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    if (!token) {
      res.status(403).send({
        msg: "There was a problem with your request. Please try again later.",
      });
      resolve();
    }

    const fetchData = async () => {
      const ifExist = await prisma.nFTData.findMany({
        where: {
          collectionSlug: collectionSlug,
          tokenId: tokenId,
        },
      });

      if (ifExist.length > 0) {
        await prisma.nFTData.update({
          where: { id: ifExist[0].id },
          data: {
            collectionSlug: collectionSlug,
            tokenId: tokenId,
            userPrice: userPrice,
            userAddress: address,
          },
        });

        res.status(200).json({ message: `Updated successfully` });
        resolve();
      } else {
        await prisma.nFTData.create({
          data: {
            collectionSlug: collectionSlug,
            tokenId: tokenId,
            userPrice: userPrice,
            userAddress: address,
          },
        });

        res.status(200).json({ message: `Created successfully` });
        resolve();
      }
    };

    if (req.method === "POST") {
      if (tokenId && address && collectionSlug && userPrice && token) {
        const result = utils.isAddress(address);
        if (result) {
          request(verificationUrl, (err, response, body) => {
            if (err) {
              res.status(403).send({ msg: "Unable to process request." });
              resolve();
            }

            const { success, score } = JSON.parse(body);

            if (!success || score < 0.4) {
              res.status(403).send({
                msg: "Sending failed. Robots aren't allowed here.",
                score: score,
              });
              resolve();
            } else {
              fetchData();
            }
          });
        } else {
          res.status(405).json({ message: `Address not valid` });
          resolve();
        }
      } else {
        res.status(405).json({ message: `Information not valid` });
        resolve();
      }
    } else {
      res.status(405).json({ message: `Method not allowed` });
      resolve();
    }
  });
}

export default protectAPI(handler);
