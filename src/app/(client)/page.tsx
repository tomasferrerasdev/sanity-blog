import { Post } from "@/interfaces/post";
import { client } from "@/sanity/lib/client";
import Link from "next/link";

const getPosts = async () => {
  const query = `
  *[_type == "post"] {
    title,
    slug,
    publishedAt,
    excerpt
  }
  `;

  const data: Post[] = await client.fetch(query);
  return data;
};

export default async function Home() {
  const posts = await getPosts();
  if (!posts) return null;

  return (
    <div className="w-full min-h-screen">
      <section className="flex flex-col gap-4">
        {posts.length > 0 &&
          posts.map((post) => (
            <Link key={post.slug.current} href={`/${post.slug.current}`}>
              <article className="border-b border-gray-200 py-4">
                <h2 className="text-xl font-bold text-basement mb-1">
                  {post.title}
                </h2>
                <p className="text-gray-300">{post.excerpt}</p>
              </article>
            </Link>
          ))}
      </section>
    </div>
  );
}
