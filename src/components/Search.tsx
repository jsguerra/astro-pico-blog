import React, { useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";

export type SearchItem = {
  title: string;
  description: string;
  slug: string;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

export default function Search({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = new Fuse(searchList, {
    keys: ["title", "description"],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.5,
  });

  useEffect(() => {
    let inputResult = inputVal.length > 1 ? fuse.search(inputVal) : [];
    setSearchResults(inputResult);
  }, [inputVal]);

  return (
    <React.Fragment>
      <label>
        <input
          ref={inputRef}
          type="text"
          name="search"
          autoComplete="off"
          autoFocus
          placeholder="Search for anything..."
          value={inputVal}
          onChange={changeHandler}
        />
      </label>

      {inputVal.length > 1 && (
        <div>
          Found {searchResults?.length}
          {searchResults?.length && searchResults?.length === 1
            ? " result"
            : " results"}{" "}
          for '{inputVal}'
        </div>
      )}

      <ul>
        {searchResults &&
          searchResults.map(({ item, refIndex }) => (
            <li key={refIndex}>{item.title}</li>
          ))}
      </ul>
    </React.Fragment>
  );
}
