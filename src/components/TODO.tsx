import type { ReactNode } from "react";

/**
 * Visible placeholder for content not yet provided. `grep -rn "TODO" src content` lists every one.
 * Shows a neutral "Pending confirmation" tag for the management preview; the source file stays in data-todo and the tooltip.
 */
export function TODO({ source, inline = false, children }: { source: string; inline?: boolean; children: ReactNode }) {
  const Tag = inline ? "span" : "div";
  return (
    <Tag className={inline ? "todo todo-inline" : "todo"} data-todo={source} title={`To be provided: ${source}`}>
      <span className="todo-tag">Pending confirmation</span>
      {!inline && <span className="todo-text">{children}</span>}
    </Tag>
  );
}
