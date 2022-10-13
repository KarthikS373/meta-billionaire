import prisma from "../../lib/prisma";
import protectAPI from "../../middleware/protectAPI";
import request from "request";

async function handler(req: any, res: any) {
  return new Promise((resolve: any) => {
    const { productId, token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    if (!token) {
      res.status(403).send({
        msg: "There was a problem with your request. Please try again later.",
      });
      resolve();
    }

    const getRandomInt = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const fetchData = async () => {
      try {
        let buyerName: any = [];

        const allProducts = await prisma.product.findMany({
          where: {
            productId: productId.toString(),
          },
          include: {
            owner: true,
          },
        });

        if (allProducts.length > 0) {
          await allProducts.map((product) => {
            Array.from({ length: product.quantity }, () =>
              buyerName.push(product.owner.name || product.owner.wallet)
            );
          });

          const randomIndex = getRandomInt(0, buyerName.length);

          const ifExist = await prisma.raffleWinner.findMany({
            where: {
              productId: productId.toString(),
            },
          });

          if (ifExist.length > 0) {
            const updatedWinner = await prisma.raffleWinner.update({
              where: {
                productId: productId.toString(),
              },
              data: {
                winner: buyerName[randomIndex].toString(),
              },
            });

            res.status(200).json({ data: updatedWinner });
            resolve();
          } else {
            const createdWinner = await prisma.raffleWinner.create({
              data: {
                productId: productId.toString(),
                winner: buyerName[randomIndex].toString(),
              },
            });
            res.status(200).json({
              data: createdWinner,
            });
            resolve();
          }
        } else {
          res.status(405).json({ message: `There is no products` });
          resolve();
        }
      } catch (err) {
        res.status(405).json({ message: `An error occured` });
        resolve();
      }
    };

    if (req.method === "POST") {
      if (productId) {
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
