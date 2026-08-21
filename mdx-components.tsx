import type { MDXComponents } from "mdx/types";

// Shared renderers for every MDX file under content/.
// Keep the mapping small, page-specific layout belongs in the route component.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
