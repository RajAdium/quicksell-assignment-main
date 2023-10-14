import { useState } from "react";
import Board from "./components/Board/Board";
import { GroupingList, OrderingList, priorityMap } from "./data/data";
import { FiSettings } from "react-icons/fi";

import "./App.css";

import { useEffect } from "react";
import { ordering, groups } from "./constants/constants";
import { getLocalStorageItem } from "./helpers/localStorage";
import { setLocalStorageItem } from "./helpers/localStorage";
import { fetchKanbanData } from "./services/fetchKanbanData";

function groupTicketsByProperty(property, state) {
    const groupedTickets = {};

    state.forEach((ticket) => {
        const value = ticket[property];
        if (!groupedTickets[value]) {
            groupedTickets[value] = [];
        }
        groupedTickets[value].push(ticket);
    });

    return groupedTickets;
}

function App() {
    const [tickets, setTickets] = useState();
    const [users, setUsers] = useState();
    const [selectedGrouping, setSelectedGrouping] = useState(() => {
        const storedState = getLocalStorageItem("selectedgrouping");
        return storedState ? storedState : groups.STATUS;
    });
    const [selectedOrdering, setSelectedOrdering] = useState(() => {
        const storedState = getLocalStorageItem("selectedordering");
        return storedState ? storedState : ordering.PRIORITY;
    });
    const [displayState, setDisplayState] = useState(() => {
        const storedState = getLocalStorageItem("currentstate");
        return storedState ? storedState : [];
    });
    const [showFilterContainer, setShowFilterContainer] = useState(false);
    function getNameById(id) {
        const foundUser = users.find((u) => u.id === id);
        return foundUser ? foundUser.name : "User not found";
    }

    useEffect(() => {
        const loadKanbanData = async () => {
            try {
                const results = await fetchKanbanData();
                // Now you can use the 'results' data here
                setTickets(results.tickets);
                setUsers(results.users);
            } catch (error) {
                // Handle the error if necessary
                console.error("Error loading kanban data:", error);
            }
        };
        loadKanbanData();
    }, []);

    useEffect(() => {
        if (tickets === undefined) return;
        if (displayState.length === 0) {
            const ticketsGroupedByStatus = groupTicketsByProperty(
                "status",
                tickets
            );
            setDisplayState(ticketsGroupedByStatus);
            setLocalStorageItem("currentstate", ticketsGroupedByStatus);
        }
    }, [tickets]);

    const groupHandler = (e) => {
        setShowFilterContainer(false);
        setSelectedGrouping(e.target.value);
        setLocalStorageItem("selectedgrouping", e.target.value);
        if (e.target.value === "user") {
            const ticketsGroupedByName = groupTicketsByProperty(
                "userId",
                tickets
            );
            Object.keys(ticketsGroupedByName).forEach(function (key) {
                var newkey = getNameById(key);
                ticketsGroupedByName[newkey] = ticketsGroupedByName[key];
                delete ticketsGroupedByName[key];
            });

            setDisplayState(ticketsGroupedByName);
            setLocalStorageItem("currentstate", ticketsGroupedByName);
        } else if (e.target.value === "status") {
            const ticketsGroupedByStatus = groupTicketsByProperty(
                "status",
                tickets
            );
            setDisplayState(ticketsGroupedByStatus);
            setLocalStorageItem("currentstate", ticketsGroupedByStatus);
        } else if (e.target.value === "priority") {
            const ticketsGroupedByPriority = groupTicketsByProperty(
                "priority",
                tickets
            );

            Object.keys(ticketsGroupedByPriority).forEach(function (key) {
                var newkey = priorityMap[key];
                ticketsGroupedByPriority[newkey] =
                    ticketsGroupedByPriority[key];
                delete ticketsGroupedByPriority[key];
            });
            setDisplayState(ticketsGroupedByPriority);
            setLocalStorageItem("currentstate", ticketsGroupedByPriority);
        }
    };
    const orderHandler = (e) => {
        setShowFilterContainer(false);
        setSelectedOrdering(e.target.value);
        setLocalStorageItem("selectedordering", e.target.value);
        if (e.target.value === "priority") {
            const sortTasksByPriority = (tasks) => {
                return tasks.slice().sort((a, b) => b.priority - a.priority);
            };

            const sortedData = {};

            for (const userName in displayState) {
                const userTasks = displayState[userName];
                const sortedTasks = sortTasksByPriority(userTasks);
                sortedData[userName] = sortedTasks;
            }

            setDisplayState(sortedData);
            setLocalStorageItem("currentstate", sortedData);
        } else if (e.target.value === "title") {
            const sortTasksByTitleAscending = (tasks) => {
                return tasks
                    .slice()
                    .sort((a, b) => a.title.localeCompare(b.title));
            };

            const sortedData = {};

            for (const userName in displayState) {
                const userTasks = displayState[userName];
                const sortedTasks = sortTasksByTitleAscending(userTasks);
                sortedData[userName] = sortedTasks;
            }
            setDisplayState(sortedData);
            setLocalStorageItem("currentstate", sortedData);
        }
    };

    return (
        <article>
            <header>
                <div className="select-container">
                    <div
                        className="display-button border-curve pointer"
                        onClick={() => {
                            setShowFilterContainer((prev) => !prev);
                        }}
                    >
                        <FiSettings />
                        <p>Display</p>
                    </div>
                    {showFilterContainer ? (
                        <div className="select-popup border-curve">
                            <div className="flex-container">
                                <p>Grouping</p>
                                <select
                                    className="select-element"
                                    name="group-select"
                                    onChange={(e) => groupHandler(e)}
                                    value={selectedGrouping}
                                >
                                    {GroupingList.map((item) => (
                                        <option
                                            value={item}
                                            label={item}
                                            key={item}
                                        />
                                    ))}
                                </select>
                            </div>

                            <div className="flex-container">
                                <p>Ordering</p>
                                <select
                                    className="select-element"
                                    name="order-select"
                                    onChange={(e) => orderHandler(e)}
                                    value={selectedOrdering}
                                >
                                    {OrderingList.map((item) => (
                                        <option
                                            value={item}
                                            label={item}
                                            key={item}
                                        />
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : null}
                </div>
            </header>
            <main className="main-container">
                <div className="board-grid-container">
                    <div className="board-grid-inner">
                        {Object.keys(displayState).map((data) => {
                            return (
                                <Board
                                    header={data}
                                    tickets={displayState[data]}
                                    key={data}
                                />
                            );
                        })}
                    </div>
                </div>
            </main>
        </article>
    );
}

export default App;
