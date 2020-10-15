import React from "react";
import getDate from "../../../helpers/getDate";

export default function TrackStatus ({ activeOrder, status, trackHandler }) {
    return (
        <div>
            <p>Номер для отслеживания: <span className="tracknumber">{activeOrder.tracknumber}</span></p>
            {
                activeOrder.delivery_type !== 1 && activeOrder.delivery_type !== 6 &&
                <p onClick={() => !!!status.status && trackHandler()} className="track-status">
                    {
                        !!!status.status ?
                            'Показать статус' :
                            !!status.date ? status.status + ' ' + getDate(status.date) : status.status
                    }
                </p>
            }
        </div>
    )
}