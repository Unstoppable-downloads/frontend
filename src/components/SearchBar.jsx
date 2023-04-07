import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import SendForm from "./Upload/SendForm";
import { AceContext } from "../context/context";
import { fetchSearchData } from "../shared/searchData";

const APP_NAME = process.env.REACT_APP_NAME;

const SearchBar = () => {
  const {
    setIsSearching,
    searchTerms,
    setsearchTerms,
    filesSearched,
    setFilesSearched,
  } = useContext(AceContext);
  const [searchSelectedCategories, setSearchSelectedCategories] = useState([]);

  useEffect(() => {}, [filesSearched]);
  useEffect(() => {
    console.log("Selected categories", searchSelectedCategories)
  }, [searchSelectedCategories])


  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    console.log(await fetchSearchData(searchTerms, searchSelectedCategories, 100));
    setFilesSearched(await fetchSearchData(searchTerms, searchSelectedCategories, 100));
  };

  function toggleSelectedCategories(category) {
    setSearchSelectedCategories(searchSelectedCategories => {
      var arr = searchSelectedCategories;
      if (arr.length > 0) {
        if(arr.includes(category)) {
          const newArr = arr.filter(i => i !== category); // remove item
          console.log(newArr)
          arr = newArr
        } else {
          arr = [...arr, category]; // add item
        }
      } else {
        arr = [...arr, category];
      }
      return arr;
    })
  }

  return (
    <>
      <form
        className="w-full px-4"
        onSubmit={async (e) => {
          await handleOnSubmit(e);
        }}
      >
        <div className="relative py-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 bottom-0 left-8 my-auto h-6 w-6 text-gray-400 z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="h-28 w-full rounded-l-full rounded-r-full border-2 border-iexblk bg-iexwhite py-3 pl-16 pr-6 text-3xl text-iexblk outline-none focus:border-main focus:bg-iexwhite hover:drop-shadow-xl"
            onChange={(e) => {
              setsearchTerms(e.target.value);
            }}
          />
        </div>
        <div className="mx-auto flex items-center justify-center py-4 text-xl text-iexblk">
          <div className="mr-8">
            <input
              type="checkbox"
              name="movie"
              value="movie"
              id="movie"
              onClick={() => {
                toggleSelectedCategories("movie");
              }}
            />
            <label htmlFor="movie" className="ml-2">
              Movie
            </label>
          </div>
          <div className="mr-8">
            <input
              type="checkbox"
              name="music"
              value="music"
              id="music"
              onClick={(e) => {
                toggleSelectedCategories("music");
              }}
            />
            <label htmlFor="music" className="ml-2">
              Music
            </label>
          </div>
          <div className="mr-8">
            <input
              type="checkbox"
              name="series"
              value="series"
              id="series"
              onClick={(e) => {
                toggleSelectedCategories("series");
              }}
            />
            <label htmlFor="series" className="ml-2">
              Series
            </label>
          </div>
          <div className="mr-8">
            <input
              type="checkbox"
              name="ebook"
              value="ebook"
              id="ebook"
              onClick={() => {
                toggleSelectedCategories("ebook");
              }}
            />
            <label htmlFor="ebook" className="ml-2">
              E-book
            </label>
          </div>
          <div className="mr-8">
            <input
              type="checkbox"
              name="software"
              value="software"
              id="software"
              onClick={() => {
                toggleSelectedCategories("software");
              }}
            />
            <label htmlFor="software" className="ml-2">
              Software
            </label>
          </div>
          <div className="mr-8">
            <input
              type="checkbox"
              name="game"
              value="game"
              id="game"
              onClick={() => {
                toggleSelectedCategories("game");
              }}
            />
            <label htmlFor="game" className="ml-2">
              Game
            </label>
          </div>
          <div className="">
            <input
              type="checkbox"
              name="other"
              value="other"
              id="other"
              onClick={() => {
                toggleSelectedCategories("other");
              }}
            />
            <label htmlFor="other" className="ml-2">
              Other
            </label>
          </div>
        </div>
      </form>
    </>
  );
};

export default SearchBar;