import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { AceContext } from "../../context/context";
import SearchBar from "../../components/SearchBar";
import { sizeToReadableSize } from "../../utils/sizeToReadableSize";
import SideBar from "../../components/Sidebar";
import { fetchSearchOne, fetchIMDBResult } from "../../shared/searchData";
const APP_NAME = process.env.REACT_APP_NAME;
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG === "true";

function Details() {
  const { uid } = useParams();
  const { detailFile, setDetailFile } = useContext(AceContext);

  useEffect(() => {
    const fetchOne = async () => {
      if (detailFile) console.log("detailFile.fileName", detailFile.fileName);
      if (detailFile) {
        console.log(await fetchSearchOne(detailFile.fileName, detailFile.uid));
      }
    };
    fetchOne();
  }, [detailFile]);

  useEffect(() => {
    const fetchIMDB = async () => {
      if (detailFile) {
        const imdbResult = await fetchIMDBResult(detailFile.fileName);
      }
    };
    fetchIMDB();
  }, [detailFile]);

  return (
    <>
      <Helmet>
        <title>
          {APP_NAME} | {detailFile.title}
        </title>
      </Helmet>

      <div className="flex">
        <div className="w-full">
          {detailFile && (
            <>
              <div className="flex">
                {detailFile.imdbImageUrl && (
                  <img className="w-2xl object-scale-down" src={detailFile.imdbImageUrl} alt="Image" />
                )}
                <div className="flex flex-col">
                  <h1 className="mb-4 text-4xl font-bold">{detailFile.title}</h1>
                  {detailFile.directedBy && (
                    <p className="my-4">Directed by {detailFile.directedBy}</p>
                  )}
                  <p className="my-4">{detailFile.description}</p>
                  {detailFile.year && (
                    <p className="mt-4">Year{detailFile.year}</p>
                  )}
                </div>
              </div>
              <p className="my-4">Filename: {detailFile.fileName}</p>
              {detailFile.starring && (
                <p className="my-4">Starring: {detailFile.starring}</p>
              )}
              <p className="my-4">Chunks: {detailFile.chunks.length}</p>
              <p className="my-4">Number of Downloads: {detailFile.nbDownloads}</p>
              <p className="my-4">Category {detailFile.category}</p>
              {detailFile.imdb && (
                <p className="my-4">IMDB {detailFile.imdb}</p>
              )}
              <p className="my-4">
                Size: {sizeToReadableSize(detailFile.fileSize)[0]} {sizeToReadableSize(detailFile.fileSize)[1]}
              </p>
              {console.log(detailFile.imdbImageUrl)}
            </>
          )}
          {/* <h1 className="text-3xl">{detailFile.title}</h1>
          <p>{detailFile.description}</p>
          {console.log(uid)} */}
        </div>

        <div>
          <div className="flex w-max flex-col bg-sidebar">
            <div className="w-full">
              <SideBar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Details;
