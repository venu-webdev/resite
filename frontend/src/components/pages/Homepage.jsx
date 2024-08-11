import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "./../../axios";

const Homepage = () => {
  // const resultSets = [
  //   {
  //     resultSetId: 201,
  //     resultDate: "20-Mar-2023",
  //     resultTitle:
  //       "M.Tech I Semester (R21) Regular & Supplementary Examinations, February 2024",
  //   },
  //   {
  //     resultSetId: 202,
  //     resultDate: "24-Apr-2023",
  //     resultTitle:
  //       "M.Tech II Semester (R17) Supplementary Examinations, February 2024",
  //   },
  //   {
  //     resultSetId: 203,
  //     resultDate: "25-Apr-2023",
  //     resultTitle:
  //       "B.Tech I Semester (R21) Regular & Supplementary Examinations, February 2024",
  //   },
  //   {
  //     resultSetId: 204,
  //     resultDate: "29-May-2024",
  //     resultTitle:
  //       "B.Pharmacy I Year II Semester (R15) Supplementary Examinations, April 2023",
  //   },
  //   {
  //     resultSetId: 201,
  //     resultDate: "28-May-2024",
  //     resultTitle:
  //       "B.Tech IV Year II Semester (R15) Supplementary Examinations, May 2024",
  //   },
  // ];
  const [resultSets, setResultSets] = useState([]);

  const getResults = () => {
    axios
      .get("http://localhost:3000/api/results")
      .then((res) => {
        if (res.data.msg) {
          console.log("res.data:", res.data);
          setResultSets([]);
        } else {
          console.log("res.data:", res.data);
          setResultSets(res.data);
        }
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };

  useEffect(() => {
    getResults();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-5 mx-auto max-w-5xl p-4 pt-0 mt-4">
        <div className="w-full border-transparent text-white p-2 rounded-md drop-shadow-md bg-red-500 m-auto flex flex-col items-center justify-center text-xl font-medium">
          Published Results
        </div>
        <ResultSetTable resultSets={resultSets} />
      </div>
    </>
  );
};

const ResultSetTable = ({ resultSets }) => {
  return (
    <div className="border-2 rounded-md flex flex-col">
      <div className="flex flex-row px-4 py-4 bg-gray-200">
        <div className="px-6">PublishDate</div>
        <div className="flex-1 px-6">Result</div>
        <div className="px-6">Link</div>
      </div>
      {resultSets.length > 0
        ? resultSets.map((resultSet, i) => {
            return (
              <div key={i}>
                <ResultSet
                  resultSetId={resultSet.resultSetId}
                  resultTitle={resultSet.resultTitle}
                  resultDate={resultSet.resultDate}
                />
                <hr />
              </div>
            );
          })
        : "no results"}
    </div>
  );
};

const ResultSet = ({ resultDate, resultTitle, resultSetId }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row px-4 py-4 text-sm items-center">
      <div className="px-6">{resultDate}</div>
      <div className="flex-1 px-6 min-w-0">{resultTitle}</div>
      <button
        onClick={() => {
          navigate(`/resultSetId/${resultSetId}`, {
            state: {
              resultSetId: resultSetId,
              resultTitle,
            },
          });
        }}
        id={resultSetId}
        className="px-4 border-blue-200 transition-all border-2 rounded-md p-2 text-blue-500 hover:bg-blue-500 hover:text-white hover:border-transparent"
      >
        Show
      </button>
    </div>
  );
};
export default Homepage;
