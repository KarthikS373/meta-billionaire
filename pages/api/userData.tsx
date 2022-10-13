import { utils } from "ethers";
import axios from "axios";
import prisma from "../../lib/prisma";
import protectAPI from "../../middleware/protectAPI";
import request from "request";

async function handler(req: any, res: any) {
  return new Promise((resolve: any) => {
    const { address, cursorPage, token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    if (!token) {
      res.status(403).send({
        msg: "There was a problem with your request. Please try again later.",
      });
      resolve();
    }

    const fetchData = async () => {
      const data = await axios.get(
        `https://api.opensea.io/api/v1/assets?format=json&limit=50&order_direction=desc&owner=${address}&cursor=${cursorPage}`,
        {
          headers: {
            //@ts-ignore
            "X-API-KEY": process.env.OPENSEA_KEY,
          },
        }
      );

      if (!data) {
        res
          .status(405)
          .json({ message: `Can't retrieve information from OpenSea` });
        resolve();
      }

      const collectionData = await axios.get(
        `https://api.opensea.io/api/v1/collections?format=json&limit=300&asset_owner=${address}`,
        {
          headers: {
            //@ts-ignore
            "X-API-KEY": process.env.OPENSEA_KEY,
          },
        }
      );
      if (!collectionData) {
        res
          .status(405)
          .json({ message: `Can't retrieve information from OpenSea` });
        resolve();
      }

      const ifExist = await prisma.user.findMany({
        where: {
          wallet: address,
        },
      });

      const userProducts = await prisma.product.findMany({
        where: {
          authorId: address,
        },
      });

      res.status(200).json({
        data: data.data,
        collection: collectionData.data,
        user: ifExist.length > 0 ? ifExist : false,
        products: userProducts,
        address: address,
      });
      resolve();
    };

    if (req.method === "POST") {
      if (address) {
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
        res.status(405).json({ message: `Address not found` });
        resolve();
      }
    } else {
      res.status(405).json({ message: `Method not allowed` });
      resolve();
    }
  });
}

export default protectAPI(handler);
