import type { MDXComponents } from "mdx/types";
import {
  Callout,
  Stat,
  Figure,
  Pullquote,
  Divider,
  Terminal,
} from "@/components/mdx/mdx-blocks";
import { Counter } from "@/components/mdx/mdx-counter";
import { Tabs } from "@/components/mdx/mdx-tabs";

/**
 * Components available inside every `.mdx` post. Add your own widgets here and
 * they instantly become usable inside your Markdown.
 *
 * Usage in a post:
 *   <Callout type="tip">Ship the smallest version first.</Callout>
 *   <Stat value="42%" label="fewer bugs" />
 *   <Counter start={0} />
 */
export const mdxComponents: MDXComponents = {
  // Custom widgets ---------------------------------------------------------
  Callout,
  Stat,
  Figure,
  Pullquote,
  Divider,
  Terminal,
  Counter,
  Tabs,

  // Element overrides ------------------------------------------------------
  a: (props) => {
    const href = String(props.href ?? "");
    const external = href.startsWith("http");
    return (
      <a
        {...props}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
      />
    );
  },
};
