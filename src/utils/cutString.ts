export default function cutString(str: string): string {
  return str.length > 20
    ? Buffer.from(str.substring(0, 12) + "...", "utf-8").toString() 
    : str;
}
