import type { Metadata } from "next";
import { getAllPostsFull } from "@/lib/content";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { BlogSearch } from "@/components/blog-search";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes and build logs by " + site.name + ".",
};

export default function BlogPage() {
  const posts = getAllPostsFull();

  return (
    <div className="page pb-16 pt-32 md:pt-36">
      <SectionHeading
        id="03"
        label="writing/"
        title="WRITING"
        description="My thoughts on security and privacy, as well as whatever I'm currently learning about."
      />

      <BlogSearch posts={posts} />
    </div>
  );
}
