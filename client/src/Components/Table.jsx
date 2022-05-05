import React, { useState } from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import { Button, PageButton } from "../helpers/Button";
import { classNames } from "../helpers/Utils";
import { SortIcon, SortUpIcon, SortDownIcon } from "../helpers/Icons";
import { getCookie } from "../helpers/auth";
import axios from "axios";
import { toast } from "react-toastify";
import jwt from "jsonwebtoken";
import languageData from "../config/Languages.json";
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">Search:</span>
      <input
        type="text"
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </label>
  );
}
function refreshPage() {
  window.location.reload(false);
}
function deleteFMEA(id) {
  let language = localStorage.getItem("language");
  const token = getCookie("token");
  axios
    .delete(`${process.env.REACT_APP_API_URL}/fmea/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      toast.success(languageData.toast_fmea_deleted);
      refreshPage();
    })
    .catch((err) => {
      console.log(err);
      toast.error(languageData.toast_something_went_wrong[language]);
    });
}
function deleteUser(id) {
  let language = localStorage.getItem("language");
  const token = getCookie("token");
  let currentUser = jwt.decode(token);

  if (currentUser._id === id) {
    toast.error(languageData.toast_cannot_delete_yourself[language]);
  } else {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success(languageData.toast_user_deleted[language]);
        refreshPage();
      })
      .catch((err) => {
        console.log(err);
        toast.error(languageData.toast_something_went_wrong[language]);
      });
  }
}
// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">{render("Header")}: </span>
      <select
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StatusPill({ value }) {
  let language = localStorage.getItem("language");
  if (!language) {
    language = "en";
  }
  const status = value ? value.toLowerCase() : "unknown";
  let status_translated = null;
  if (status.startsWith("complete")) {
    status_translated = languageData.status_complete[language];
  }
  if (status.startsWith("incomplete")) {
    status_translated = languageData.status_incomplete[language];
  }

  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
        status.startsWith("complete") ? "bg-green-100 text-green-800" : null,
        status.startsWith("incomplete") ? "bg-red-100 text-red-800" : null
      )}
    >
      {status_translated}
    </span>
  );
}

export function RolePill({ value }) {
  let language = localStorage.getItem("language");
  if (!language) {
    language = "en";
  }
  const role = value ? value.toLowerCase() : "user";
  let role_translated = null;
  if (role.startsWith("user")) {
    role_translated = languageData.role_user[language];
  }
  if (role.startsWith("admin")) {
    role_translated = languageData.role_admin[language];
  }
  if (role.startsWith("superadmin")) {
    role_translated = languageData.role_superadmin[language];
  }
  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
        role.startsWith("user") ? "bg-green-100 text-green-800" : null,
        role.startsWith("admin") ? "bg-yellow-100 text-yellow-800" : null,
        role.startsWith("superadmin") ? "bg-red-100 text-red-800" : null
      )}
    >
      {role_translated}
    </span>
  );
}

export function ActionButtonsUser({ value }) {
  let language = localStorage.getItem("language");
  if (!language) {
    language = "en";
  }
  const editurl = `/superadmin/editUser/${value}`;
  const [showModalUser, setShowModalUser] = React.useState(false);
  return (
    <>
      <span className="px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm bg-yellow-100 text-yellow-800">
        <a href={editurl}> {languageData.actionbutton_edit[language]} </a>
      </span>
      <button
        className="px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm bg-red-100 text-red-800"
        onClick={() => setShowModalUser(value)}
      >
        {languageData.actionbutton_delete[language]}
      </button>
      {/* start of modal */}
      <>
        {showModalUser ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-black-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      {languageData.table_are_you_sure_user[language]}
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModalUser(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <p className="my-4 text-black-500 text-lg leading-relaxed flex-auto">
                      {
                        languageData.table_delete_user_message_part_one[
                          language
                        ]
                      }
                      <br />
                      {
                        languageData.table_delete_user_message_part_two[
                          language
                        ]
                      }
                    </p>
                    <hr />
                    <small>User id: {value}</small>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-black-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModalUser(false)}
                    >
                      {languageData.modal_close[language]}
                    </button>

                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => deleteUser(value)}
                    >
                      {languageData.actionbutton_delete[language]}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
      {/* end of model */}
    </>
  );
}

export function ActionButtons({ value }) {
  let language = localStorage.getItem("language");
  if (!language) {
    language = "en";
  }
  const url = `/fmea/view/${value}`;
  const editurl = `/fmea/edit/${value}`;
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <span className="px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm bg-blue-100 text-blue-800">
        <a href={url}> {languageData.actionbutton_view[language]} </a>
      </span>

      <span className="px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm bg-yellow-100 text-yellow-800">
        <a href={editurl}> {languageData.actionbutton_edit[language]} </a>
      </span>
      <button
        className="px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm bg-red-100 text-red-800"
        onClick={() => setShowModal(value)}
      >
        {languageData.actionbutton_delete[language]}
      </button>

      {/* start of modal */}
      <>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-auto overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-black-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      {languageData.table_are_you_sure_fmea[language]}
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <p className="my-4 text-black-500 text-lg leading-relaxed">
                      {
                        languageData.table_delete_fmea_message_part_one[
                          language
                        ]
                      }
                      <br />
                      {
                        languageData.table_delete_fmea_message_part_two[
                          language
                        ]
                      }
                    </p>
                    <hr />
                    <small>FMEA id: {value}</small>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-black-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      {languageData.modal_close[language]}
                    </button>

                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => deleteFMEA(value)}
                    >
                      {languageData.modal_delete[language]}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
      {/* end of model */}
    </>
  );
}

//

export function AvatarCell({ value, column, row }) {
  return (
    <div className="flex items-center">
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">
          {row.original[column.emailAccessor]}
        </div>
      </div>
    </div>
  );
}

function Table({ columns, data, language }) {
  // Use the state and functions returned from useTable to build your UI

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    usePagination // new
  );

  // Render the UI for your table
  return (
    <>
      <div className="sm:flex sm:gap-x-2">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div className="mt-2 sm:mt-0" key={column.id}>
                {column.render("Filter")}
              </div>
            ) : null
          )
        )}
      </div>
      {/* table */}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200 table-auto"
              >
                <thead className="bg-gray-200">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          scope="col"
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div className="flex items-center justify-between">
                            {column.render("Header")}
                            {/* Add a sort direction indicator */}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SortDownIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <SortUpIcon className="w-4 h-4 text-gray-400" />
                                )
                              ) : (
                                <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {page.map((row, i) => {
                    // new
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-4 whitespace-nowrap"
                              role="cell"
                            >
                              {cell.column.Cell.name === "defaultRenderer" ? (
                                <div className="text-sm text-gray-500">
                                  {cell.render("Cell")}
                                </div>
                              ) : (
                                cell.render("Cell")
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
              <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Per Page</span>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={state.pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 20].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <PageButton
                className="rounded-l-md"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                <span className="sr-only">Next</span>
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton
                className="rounded-r-md"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default Table;
