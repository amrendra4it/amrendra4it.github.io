module.exports = function (eleventyConfig) {
  // Copy the CSS folder straight through to the output, untouched
  eleventyConfig.addPassthroughCopy("src/assets");

  // Turns a date like "2026-07-01" into "Jul 01, 2026"
  eleventyConfig.addFilter("readableDate", (dateInput) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  });

  // All regular blog posts, newest first
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md").reverse();
  });
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/ads.txt");   // add this

  // Just the posts tagged "leetcode", newest first — powers /leetcode/
  eleventyConfig.addCollection("leetcode", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .filter((post) => post.data.tags && post.data.tags.includes("leetcode"))
      .reverse();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
