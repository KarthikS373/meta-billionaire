import prisma from "../../lib/prisma";
import protectAPI from "../../middleware/protectAPI";
import { utils } from "ethers";
import request from "request";

async function handler(req: any, res: any) {
  return new Promise((resolve: any) => {
    const { address, lng, lat, token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    if (!token) {
      res.status(403).send({
        msg: "There was a problem with your request. Please try again later.",
      });
      resolve();
    }

    const fetchData = async () => {
      const checkIfExist = await prisma.map.findUnique({
        where: {
          wallet: address,
        },
      });

      if (checkIfExist) {
        await prisma.map.update({
          where: {
            wallet: address,
          },
          data: {
            wallet: address,
            lng: lng.toString(),
            lat: lat.toString(),
          },
        });

        res.status(200).json({ message: `Updated successfully` });
        resolve();
      } else {
        await prisma.map.create({
          data: {
            wallet: address,
            lng: lng.toString(),
            lat: lat.toString(),
          },
        });
        res.status(200).json({ message: `Add successfully` });
        resolve();
      }
    };

    if (req.method === "POST") {
      if (address && lng && lat) {
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
