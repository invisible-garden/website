import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `text-*` is ambiguous: it can be a font size or a text colour. tailwind-merge
 * knows the built-in sizes, but ours are custom theme tokens, so it read
 * `text-body-md` as a colour and dropped it whenever a component also set
 * `text-white`. The button lost its font size that way, silently, because the
 * body's own 16px happened to match. Registering the scale fixes the class of
 * bug rather than the one instance: `text-headline-sm text-white` would have
 * lost the heading size outright.
 *
 * Keep this list in step with the type scale in app/globals.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "headline-lg",
            "headline-md",
            "headline-sm",
            "body-lg",
            "body-md",
            "body-sm",
            "label",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
