import axios from "axios";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useLocation } from "react-router-dom";

const ResultsPage = () => {
  const { state } = useLocation();
  console.log("state: ", state);
  const [regNo, setRegNo] = useState("");
  const [result, setResult] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted the form", regNo);
    axios
      .post(`http://localhost:3000/api/result/${state.resultSetId}`, {
        regNo,
      })
      .then((res) => {
        console.log("res.data", res.data);
        if (res.data.subjects && res.data.result) {
          setSubjects(res.data.subjects);
          setResult(res.data.result);
          setShowTable(true);
          console.log("result res: ", res.data.result, res.data.subjects);
        } else {
          setSubjects([]);
          setResult([]);
          setShowTable(false);
          console.log(res.data);
        }
        setClicked(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const subjects = ["ML", "IOT", "ST", "B-VLSI", "IPR&P"];

  // const columns = [];
  // if (subjects.length > 0) {
  //   subjects.forEach((subject) => {
  //     columns.push({
  //       name: subject,
  //       selector: (row) => row[subject],
  //       sortable: true,
  //     });
  //   });
  //   columns.push({
  //     name: "Total",
  //     selector: (row) => row["TOTAL"],
  //     sortable: true,
  //   });
  //   columns.push({
  //     name: "Percentage",
  //     selector: (row) => row["%"],
  //     sortable: true,
  //   });
  // }

  console.log("result: ", result);
  // const columns = [
  //   {
  //     name: "ML",
  //     selector: (row) => row["ML"],
  //   },
  //   {
  //     name: "IOT",
  //     selector: (row) => row["IOT"],
  //   },
  //   {
  //     name: "ST",
  //     selector: (row) => row["ST"],
  //   },
  //   {
  //     name: "B-VLSI",
  //     selector: (row) => row["B-VLSI"],
  //   },
  //   {
  //     name: "IPR&P",
  //     selector: (row) => row["IPR&P"],
  //   },
  //   {
  //     name: "Total",
  //     selector: (row) => row["TOTAL"],
  //   },
  //   {
  //     name: "Percentage",
  //     selector: (row) => row["%"],
  //   },
  // ];

  // const data = [
  //   {
  //     "S.No": 1,
  //     "Reg No": "218P1A0566",
  //     "Name of the Student": "PELLAM REDDI NAGA LAKSHMI",
  //     CD: 29,
  //     ML: 29,
  //     IOT: 30,
  //     "B-VLSI": 25,
  //     ST: 27,
  //     "IPR&P": 30,
  //     TOTAL: 170,
  //     "%": 94.44,
  //   },
  // ];
  console.log("regNo:", regNo);
  return (
    <div className="flex mt-4 max-w-5xl flex-col mx-auto items-center justify-center py-4 px-4">
      <div className="text-base rounded-md bg-blue-100 border-transparent mb-4 border-2 p-3 flex gap-2 items-center justify-center mx-auto">
        <div>Title: </div>
        <div className="font-medium">{state.resultTitle}</div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full sm:max-w-96 gap-4 items-center m-auto"
      >
        <div className="flex flex-col w-full">
          <label htmlFor="regno" className="my-2 font-semibold">
            Enter Hallticket Number:
          </label>
          <input
            className="border-2 rounded-md p-2"
            type="text"
            required
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
          />
        </div>
        <button className="bg-blue-500 p-2 px-4 rounded-md text-white w-full font-semibold hover:bg-blue-400">
          Submit
        </button>
      </form>
      {clicked ? (
        showTable ? (
          <div className="my-8 w-full sm:max-w-xl">
            <hr className="mb-6" />
            <ResultTable result={result} subjects={subjects} />
          </div>
        ) : (
          <div className="w-fit m-auto my-4 text-red-500">No Records found</div>
        )
      ) : (
        ""
      )}
    </div>
  );
};

const ResultTable = ({ result, subjects }) => {
  console.log("in table");
  return (
    <>
      <div className="flex gap-10 items-center m-auto w-full justify-center mb-4">
        <div className="text-xs">
          Reg No:{" "}
          <div className="text-base text-green-700 font-semibold">
            {result["Reg No"]}
          </div>
        </div>
        <div className="text-xs">
          Name:{" "}
          <div className="text-base text-green-700 font-semibold">
            {result["NAME"]}
          </div>
        </div>
      </div>
      <div>
        <table className="w-full mx-auto bg-transparent">
          <thead className="bg-blue-500 text-white px-4 rounded-md">
            <tr className="bg-transparent">
              <td className="p-2 pl-4">S.No</td>
              <td className="">Subjects</td>
              <td className="">Marks</td>
              <td className="">Total</td>
              <td className="">Percent</td>
            </tr>
          </thead>
          <tbody className="p-2">
            {subjects?.length > 0
              ? subjects.map((subject, i) => {
                  return (
                    <tr className="border-t-2  border-gray-50" key={i}>
                      <td className="pl-2">{i + 1}</td>
                      <td className="">{subject}</td>
                      <td
                        className={` font-medium ${
                          result[subject] < 25
                            ? "text-yellow-600"
                            : "text-green-600"
                        } ${
                          result[subject] < 20
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {result.marks[i]}
                      </td>
                      {i == 0 ? (
                        <>
                          <td className="font-medium" rowSpan={subjects.length}>
                            {result["TOTAL"]}
                          </td>
                          <td className="font-medium" rowSpan={subjects.length}>
                            {result["PERCENT"]}%
                          </td>
                        </>
                      ) : (
                        ""
                      )}
                    </tr>
                  );
                })
              : ""}
          </tbody>
        </table>
      </div>
      {/* <DataTable
        columns={columns}
        data={[result]}
        className="p-2 max-w-96 sm:max-w-4xl m-auto"
      ></DataTable> */}
    </>
  );
};
export default ResultsPage;
