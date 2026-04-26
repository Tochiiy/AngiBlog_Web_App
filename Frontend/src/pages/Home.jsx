// Home page: composes IntroPost, Search, and Blogs components.
// Manages selected tag and optional search results passed into `Blogs`.
import { useState } from "react";
import Search from '../components/Search'
import IntroPost from '../components/IntroPost'
import Blogs from '../components/Blogs'


const Home = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchResults, setSearchResults] = useState(null);

  return (
    <div className='w-full max-w-6xl mx-auto px-4'>
      
      <IntroPost />
      <Search
        onTagSelect={setSelectedTag}
        onSearchResults={setSearchResults}
      />
      <Blogs
        selectedTag={searchResults ? null : selectedTag}
        searchResults={searchResults}
      />
      
    </div>
  )
}

export default Home