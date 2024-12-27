const slugify = (text: string) =>
  text.replace(/[^\p{L}\p{N}]+/ug, " ").trim().replace(/\s+/g, "-")
    .toLowerCase();

export default slugify;
