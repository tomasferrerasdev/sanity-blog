import { Post } from "@/interfaces/post";
import { client } from "@/sanity/lib/client";
import { slugify } from "@/utils/slugify";
import { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { PortableText } from "next-sanity";

const getPost = async (slug: string) => {
  const query = `
    *[_type == "post" && slug.current == "${slug}"][0] {
      title,
      slug,
      publishedAt,
      excerpt,
      _id,
      "headings": body[style in ["h2", "h3", "h4", "h5", "h6"]],
      body,
      tags[]-> {
        _id,
        slug,
        name
      },
    }
    `;

  const data: Post = await client.fetch(query);
  return data;
};

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const post: Post = await getPost(params?.slug);
  if (!post) {
    return;
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      locale: "en_US",
      url: `https://next-cms-blog-ce.vercel.app/${params.slug}`,
      siteName: "DevBlook",
      images: [
        // {
        //   url: post.image,
        // }
        // {
        //   url: urlForImage(post?.body?.find((b: any) => b._type === "image")).width(1200).height(630).url(),
        //   width: 1200,
        //   height: 630,
        // },
      ],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  return (
    <div className="w-full min-h-screen pt-12">
      <section className="flex flex-col gap-4 max-w-3xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl text-basement">{post.title}</h1>
          <p className="text-gray-300 text-sm">
            <strong>Published at:</strong> {post.publishedAt}
          </p>
          <p>{post.excerpt}</p>
        </div>
        <div className="pb-10">
          <div className={richTextStyles}>
            <PortableText
              value={post?.body}
              components={myPortableTextComponents}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const myPortableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <Image src={urlFor(value).url()} alt="Post" width={700} height={700} />
    ),
  },
  block: {
    h2: ({ value }: any) => (
      <h2
        id={slugify(value.children[0].text)}
        className="text-3xl font-bold mb-3"
      >
        {value.children[0].text}
      </h2>
    ),
    h3: ({ value }: any) => (
      <h3
        id={slugify(value.children[0].text)}
        className="text-2xl font-bold mb-3"
      >
        {value.children[0].text}
      </h3>
    ),
    h4: ({ value }: any) => (
      <h4
        id={slugify(value.children[0].text)}
        className="text-2xl font-bold mb-3"
      >
        {value.children[0].text}
      </h4>
    ),
    h5: ({ value }: any) => (
      <h5
        id={slugify(value.children[0].text)}
        className="text-2xl font-bold mb-3"
      >
        {value.children[0].text}
      </h5>
    ),
    h6: ({ value }: any) => (
      <h6
        id={slugify(value.children[0].text)}
        className="text-xl font-bold mb-3"
      >
        {value.children[0].text}
      </h6>
    ),
  },
};

const richTextStyles = `
  mt-14
  text-justify
  max-w-3xl
  m-auto
  prose-headings:my-5
  prose-heading:text-2xl
  prose-p:mb-5
  prose-p:leading-7
  prose-li:list-disc
  prose-li:leading-7
  prose-li:ml-4
  `;
