import { Link } from "./link";

/**
 * Converts URLs in a string to links
 * @param line
 */
const linkifyText = (line: string) => {
  const regex = /(https?:\/\/[^\s]+)|(@[\w.-]+)/g;

  return line.split(regex).map((part, index) => {
    if (!part) {
      return null;
    }

    if (/https?:\/\/[^\s]+/.exec(part)) {
      const url = part.replace(/https?:\/\//, "").replace(/\/$/, "");
      return (
        <Link key={index} to={part} className="text-blue-400">
          {url}
        </Link>
      );
    } else if (/@[\w.-]+/.exec(part)) {
      return (
        <Link key={index} to="/profile/$handle" params={{ handle: part.slice(1) }} className="text-blue-400">
          {part}
        </Link>
      );
    } else {
      return <span key={index}>{part}</span>;
    }
  });
};

/**
 * Converts new lines to <br> tags
 * @param text - The text to be formatted
 * @param text.text
 * @param linkify - Whether to convert URLs to links
 * @param text.linkify
 */
export function FormattedText({ text, linkify }: { text: string; linkify?: boolean; }) {
  return (
    <span>
      {text.split("\n").map((line, index) => (
        <span key={index}>
          {linkify ? linkifyText(line) : line}
          {index < text.split("\n").length - 1 && <br />}
        </span>
      ))}
    </span>
  );
}
