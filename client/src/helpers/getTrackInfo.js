import config from "./config/config";

export default async function trackInfo(delivery, track) {
    if (delivery < 4) {
        const form_body = {
            "operationName":"getTrackingInfo",
            "variables":{
                "locale":"ru",
                "websiteId":"ru",
                "trackId": track,
                "phone":null},
            "query":"query getTrackingInfo($trackId: String!, $phone: String, $websiteId: String!, $locale: String!) {\n  tracking: trackingInfo(trackId: $trackId, phone: $phone, websiteId: $websiteId, locale: $locale) {\n    orderNumber\n    status {\n      code\n      name\n      note\n }\n       trackingDetails {\n      statusName\n      city {\n        id\n        name\n        __typename\n      }\n      date\n      icon\n      __typename\n    }\n       errors {\n      message\n      code\n      __typename\n    }\n   }\n}\n"
        }

        const response = await fetch(`https://www.cdek.ru/graphql`, {
            method: 'POST',
            body: JSON.stringify(form_body),
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer bEIN3-mkIhvtGNYV1MgyiHN8d5-5Wxu4AjgvJfZw'
            }
        })
        let json = await response.json()

        if ((json.data.tracking.trackingDetails).length > 0) {
            let last = ((json.data.tracking.trackingDetails).length)-1
            let status = json.data.tracking.trackingDetails[last].statusName
            let date = json.data.tracking.trackingDetails[last].date
            return {date, status}
        } else {
            let status = json.data.tracking.status.name
            let date = Date.now()
            return {date, status}
        }



    } else {
        const response = await fetch(`${config.BACKEND}/ru-post/${track}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let json = await response.json();
        let status = json.response[0].trackingItem.trackingHistoryItemList[0].humanStatus
        let date = json.response[0].trackingItem.trackingHistoryItemList[0].date
        return {date, status}
    }
}
