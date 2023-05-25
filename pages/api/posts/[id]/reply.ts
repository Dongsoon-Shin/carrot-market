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
    body: { answer },
  } = req;

  const reply = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
          id: id ? +id : 0,
        },
      },
      answer,
    },
  });

  console.log(reply);

  res.json({
    ok: true,
    answer: reply,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
