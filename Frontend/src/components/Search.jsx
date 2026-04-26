// Search component: handles search input and tag selection, passing results to parent.
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { searchPosts } from "../services/api.js";

const tags = [
  "All", "React", "CSS", "Backend", "JavaScript",
  "Python", "Web Development", "UI/UX", "AI", "Tools",
];

const Search = ({ onTagSelect, onSearchResults }) => {
  const [focus, setFocus] = useState(0);
  const [query, setQuery] = useState("");

 const handleTagClick = (index) => {
  setFocus(index);
  onTagSelect(tags[index]);
  onSearchResults(null); // ← clear search results when tag is clicked
};

  const handleSearch = async () => {
    if (!query.trim()) return;
    const results = await searchPosts(query);
    onSearchResults(results); // sends search results up to parent
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="px-6 py-8 border-b border-gray-200">
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Explore Articles</h2>
        <p className="text-gray-500 text-sm">Find topics you love</p>

        <div className="flex items-center w-full max-w-lg border border-gray-300 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Search articles..."
            className="flex-1 px-4 py-2 outline-none text-gray-700 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 flex items-center gap-2 hover:bg-blue-600"
          >
            <IoSearchOutline className="text-lg" />
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
            <span
              id={`tag-${tag.toLowerCase().replace(/\s+/g, "-")}`}
              key={tag}
              onClick={() => handleTagClick(index)}
              className={`px-3 py-1 rounded-full cursor-pointer text-sm transition-colors ${
                focus === index
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Search;