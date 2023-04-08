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

      <div className="flex page-subcontainer">
        <div className="w-full mr-m">
          {detailFile && (
            <>
              <div className="flex mb-8">
                {detailFile.imdbImageUrl && (
                  <img className="w-2xl object-scale-down mr-8" src={detailFile.imdbImageUrl} alt="Image" />
                )}
                <div className="flex flex-col">
                  <h1 className="mb-3 text-5xl font-bold">{detailFile.title}</h1>
                  {detailFile.directedBy && (
                    <p className="my-3">Directed by {detailFile.directedBy}</p>
                  )}
                  {detailFile.casts && (
                    <p className="my-3">Starring {detailFile.casts.map((actor) => {
                      return (
                        <a 
                          href={actor.actorImdb} 
                          key={actor}
                        >
                          <span className="underline">{actor.actorName}</span>
                          ,{" "}
                        </a>
                      )
                    })}...</p>
                  )}
                  <p className="my-3">{detailFile.description}</p>
                  {detailFile.year && (
                    <p className="my-3">Year {detailFile.year}</p>
                  )}
                  <p className="my-3 italic">{detailFile.category}</p>
                  {detailFile.imdb && (
                    <p className="my-4">IMDB {detailFile.imdb}</p>
                  )}
                </div>
              </div>
              { detailFile.imdbRessourceUrl && (
                <p><a href={detailFile.imdbRessourceUrl}>View on IMDB</a></p>
              )}
              {console.log(detailFile.imdbImageUrl)}
              <table className="container w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="text-center">Filename</th>
                    <th className="text-center">Number of downloads</th>
                    <th className="text-center">Chunks</th>
                    <th className="text-center">Size</th>
                    <th className="text-center px-8">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td>{detailFile.fileName}</td>
                    <td>{detailFile.nbDownloads}</td>
                    <td>{detailFile.chunks.length}</td>
                    <td>{sizeToReadableSize(detailFile.fileSize)[0]} {sizeToReadableSize(detailFile.fileSize)[1]}</td>
                    <td>
                      <button
                        className="btn h-6 font-bold"
                        id="btn"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              
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
