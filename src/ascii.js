import figlet from "figlet";

export default function ascii(text) {
  return figlet.textSync(text);
}