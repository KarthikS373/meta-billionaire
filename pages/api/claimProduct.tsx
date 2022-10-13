import { ethers, utils } from "ethers";
import prisma from "../../lib/prisma";
import contractABI from "../../artifacts/contracts/MarketplaceERC20.sol/Marketplace.json";
import { toWeiWithDecimals } from "../../utils/helpFunctions";
import protectAPI from "../../middleware/protectAPI";
import request from "request";

async function handler(req: any, res: any) {
  return new Promise((resolve: any) => {
    const { address, productId, token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    if (!token) {
      res.status(403).send({
        msg: "There was a problem with your request. Please try again later.",
      });
      resolve();
    }

    const fetchData = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.POLYGON_API_KEY
      );

      try {
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
          contractABI.abi,
          provider
        );

        const userOwnedResult = await contract.getUserStockOwned(
          address,
          productId
        );

        const userOwnedBigNumber = ethers.BigNumber.from(userOwnedResult._hex);
        const userOwnedWei = ethers.utils.formatEther(userOwnedBigNumber);

        const userOwnedFinal = toWeiWithDecimals(Number(userOwnedWei), 18);

        if (userOwnedFinal > 0) {
          const ifExist = await prisma.user.findMany({
            where: {
              wallet: address,
            },
          });

          if (ifExist.length > 0) {
            const userProductData = await prisma.product.findMany({
              where: {
                authorId: ifExist[0].wallet,
                productId: productId.toString(),
                alreadyClaim: false,
              },
            });

            if (userProductData.length > 0) {
              const updatedProduct = await prisma.product.update({
                where: {
                  id: userProductData[0].id,
                },
                data: {
                  alreadyClaim: true,
                },
              });

              res.status(200).json({
                data: updatedProduct,
                address: address,
              });
              resolve();
            } else {
              res
                .status(405)
                .json({ message: `User does not have claimable item` });
              resolve();
            }
          } else {
            res.status(405).json({ message: `User does not exist` });
            resolve();
          }
        } else {
          res.status(405).json({ message: `Don't own product` });
          resolve();
        }
      } catch (err) {
        console.log(err);
        res.status(405).json({ message: `Can't save productId buy` });
        resolve();
      }
    };

    if (req.method === "POST") {
      if (address && productId !== null && token) {
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
