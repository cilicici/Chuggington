import { handleLogout } from './auth'

export const getLocations = (query, done, error) => {
    fetch(`/locations?query=${query}&type=station`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('autt')
            }
        })
        .then((response) => {
            if (response.status === 401) {
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((result) => {
            if (result.status === 'success') {
                const arr = result.data.stations.map(function (station) {
                    return {
                        label: station.name,
                        value: station.id,
                        station: station
                    }
                });
                done(arr)
            } else {
                error()
            }
        }).catch(function (errorResponse) {
            if (errorResponse.message === '401') {
                handleLogout()
            }
            error()
        })
};

export const getConnections = (from, to, done, error) => {
    fetch(`/connections?from=${from}&to=${to}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('autt')
            }
        })
        .then((response) => {
            if (response.status === 401) {
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((result) => {
            if (result.status === 'success' && result.data != null && result.data.connections.length > 0) {
                const fromName = result.data.from.name
                const toName = result.data.to.name
                const arr = result.data.connections.map(function (connection) {

                    const products = connection.products.map(function (product) {
                        return product
                    })
                    const transfer = connection.transfers
                    const startTime = connection.sections.map(function (section) {
                        return timeConverter(section.departure.departure) + "(" + delay(section.departure.prognosis.departure, section.departure.departure) + ")"
                    })
                    const endTime = connection.sections.map(function (section) {
                        return timeConverter(section.arrival.arrival) + "(" + delay(section.arrival.prognosis.arrival, section.arrival.arrival) + ")"
                    })
                    const delayArrivalArr = connection.sections.map(function (section) {
                        return delay(section.arrival.prognosis.arrival, section.arrival.arrival)
                    })
                    const delayDepartureArr = connection.sections.map(function (section) {
                        return delay(section.departure.prognosis.departure, section.departure.departure)
                    })

                    const interStations = connection.sections.map(function (section) {
                        return `${section.departure.location.name} - ${section.arrival.location.name}`
                    })
                    return {
                        from: fromName,
                        to: toName,
                        startTime: startTime,
                        endTime: endTime,
                        delayArrival: delayArrivalArr,
                        delayDeparture: delayDepartureArr,
                        product: products,
                        transfers: transfer,
                        interStations: interStations.length > 1 ? interStations : []
                    }
                });
                done(arr)
            } else {
                error()
            }
        }).catch(function (errorResponse) {
            if (errorResponse.message === '401') {
                handleLogout()
            }
            error()
        })
};

export const getStationsBoard = (station, done, error) => {
    fetch(`/stationsboards?id=${station}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('autt')
            }
        })
        .then((response) => {
            if (response.status === 401) {
                throw new Error(response.status)
            }
            return response.json()
        })
        .then((result) => {
            if (result.status === 'success' && result.data != null && result.data.stationboard && result.data.stationboard.length > 0) {
                const rmap = result.data.stationboard
                const arr = rmap.map(function (station) {
                    return {
                        label: station.name,
                        value: station.name,
                        station: station,
                        departure: timeConverter(station.stop.departure),
                        delay: delay(station.stop.prognosis.departure, station.stop.departure),
                        to: station.to,
                    }
                });
                done(arr)
            } else {
                error("error")
            }
        }).catch(function (errorResponse) {
            if (errorResponse.message === '401') {
                handleLogout()
            }
            error()
        })
};

function delay(prognosis, departure) {
    if (prognosis) {
        return (new Date(prognosis) - new Date(departure)) / 60000
    } else {
        return '0'
    }
}

function timeConverter(UNIX_timestamp) {
    var data = new Date(UNIX_timestamp);
    var hour = data.getHours();
    var min = data.getMinutes();
    var time = (hour < 10 ? "0" + hour : hour) + ':' + (min < 10 ? "0" + min : min);
    return time;
}
