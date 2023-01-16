import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AceContext } from "../context/context";
const APP_NAME = process.env.REACT_APP_NAME;
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG == 'true';

const Home = () => {

  const { connectedAccount } = useContext(AceContext);

  const WAITING_FOR_REQUEST = 0;
  const REQUESTING = 1;
  const READY_FOR_DOWNLOAD = 2;
  const STATUS_OPEN_ORDER = "open";
  const STATUS_COMPLETED_ORDER = "COMPLETED";
  const STATUS_ACTIVE_ORDER = "ACTIVE";



  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Sent items</title>
      </Helmet>
      <div className="py-m mx-8">
        <h1 class="table-title">Recent uploads</h1>

        <table className="w-full border-collapse max-w-full container table-auto">
          <thead>
            <tr>
              <th className="text-center">Date</th>
              <th className="text-center">Name</th>
              <th className="text-center">Size</th>
              <th className="text-center">Category</th>
              <th className="text-center">Status</th>
              <th className="text-center px-8">&nbsp;</th>
            </tr>
          </thead>
          <tbody>

            <tr class="text-center">
                <td colSpan={6}>No sent item found.</td>
            </tr>

          </tbody>
        </table>
      </div>
    </>

  );
};

export default Home;
