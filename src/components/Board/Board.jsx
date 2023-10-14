/* eslint-disable react/prop-types */
import Card from "../TicketCard/TicketCard";
import "./Board.css";
import { BsFillBarChartFill } from "react-icons/bs";
import { AiOutlinePlus, AiOutlineCheckCircle } from "react-icons/ai";
import { BiDotsHorizontalRounded, BiBadgeCheck} from "react-icons/bi";
import { SiInstatus } from "react-icons/si";
function Board({ tickets, header }) {
    return (
        <div className="board-container">
            <div className="board-header">
                <div>
                    <div className="flex-gap">
                        <BiBadgeCheck className="bg-color-light-status-icon" />
                        <p>{header}</p>
                        <span>{tickets.length}</span>
                    </div>
                </div>

                <div className="flex-gap">
                    <AiOutlinePlus className="bg-color-light-icon" />
                    <BiDotsHorizontalRounded className="bg-color-light-icon" />
                </div>
            </div>

            <div className="board-hero">
                {tickets.map((ticket) => {
                    return (
                        <Card
                            key={ticket.id}
                            id={ticket.id}
                            profileURL="https://bit.ly/prosper-baba"
                            status={ticket.status}
                            title={ticket.title}
                            tag={ticket.tag[0]}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Board;
