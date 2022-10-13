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

    const fetchData = async () => {
      const ifExist = await prisma.raffleWinner.findMany({
        where: {
          productId: productId.toString(),
        },
      });

      res.status(200).json({ data: ifExist });
      resolve();
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
