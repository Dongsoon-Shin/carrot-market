import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import { Post } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { Router, useRouter } from "next/router";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<WriteForm>();
  const [post, { loading, data }] = useMutation<WriteResponse>("/api/post");
  const onValid = (data: WriteForm) => {
    if (loading) return;
    post(data);
  };
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Write Post">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <TextArea
          register={register("question", { required: true, minLength: 5 })}
          required
          placeholder="Ask a question!"
        />
        <Button text="Submit" />
      </form>
    </Layout>
  );
};

export default Write;
