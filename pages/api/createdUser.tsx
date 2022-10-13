import { ethers, utils } from "ethers";
import prisma from "../../lib/prisma";
import contractABI from "../../contracts/mbuc/MbucABI.json";
import protectAPI from "../../middleware/protectAPI";
import request from "request";

async function handler(req: any, res: any) {
  return new Promise((resolve: any) => {
    const { address, nickName, token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    if (!token) {
      res.status(403).send({
        msg: "There was a problem with your request. Please try again later.",
      });
      resolve();
    }

    const fetchData = async () => {
      const ifExist = await prisma.user.findMany({
        where: {
          wallet: address,
        },
      });

      if (ifExist.length > 0) {
        res.status(405).json({ message: `Address already saved` });
        resolve();
      } else {
        const provider = new ethers.providers.JsonRpcProvider(
          process.env.POLYGON_API_KEY
        );

        try {
          const contract = new ethers.Contract(
            process.env.TOKEN_CONTRACT!,
            contractABI,
            provider
          );

          const balanceOfResult = await contract.balanceOf(address);
          const mbucBalanceBigNumber = ethers.BigNumber.from(
            balanceOfResult._hex
          );
          const mbucBalanceResult =
            ethers.utils.formatEther(mbucBalanceBigNumber);

          const createdUser = await prisma.user.create({
            data: {
              wallet: address,
              name: nickName,
              mbucBalance: mbucBalanceResult,
            },
          });

          res.status(200).json({
            data: createdUser,
            address: address,
          });
          resolve();
        } catch (err) {
          console.log(err);
          res.status(405).json({ message: `Address not valid` });
          resolve();
        }
      }
    };

    if (req.method === "POST") {
      if (address && nickName) {
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
