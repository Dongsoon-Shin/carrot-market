import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const alreadyExists = await client.favorits.findFirst({
    where: {
      productId: id ? +id : undefined,
      userId: user?.id,
    },
  });

  if (alreadyExists) {
    await client.favorits.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.favorits.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: id ? +id : undefined,
          },
        },
      },
    });
  }
  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
