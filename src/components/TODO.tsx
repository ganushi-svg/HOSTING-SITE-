import type { ReactNode } from "react";

/** Visible placeholder for content not yet provided. `grep -rn "TODO" src content` lists every one. */
export function TODO({ source, inline = false, children }: { source: string; inline?: boolean; children: ReactNode }) {
  const Tag = inline ? "span" : "div";
  return (
    <Tag className={inline ? "todo todo-inline" : "todo"} data-todo={source}>
      <strong>TODO</strong> {children} <code>({source})</code>
    </Tag>
  );
}
