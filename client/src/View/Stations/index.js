import React from 'react';
import AsyncSelect from 'react-select/async';
import DataTable from 'react-data-table-component';
import { getLocations, getStationsBoard } from '../../lib/transport'
import Wrapper from '../Wrapper'

const getSuggestions = (value, done) => {
    const inputValue = value.trim().toLowerCase();
    if (value !== '') {
        getLocations(inputValue, (arr) => {
            done(arr)
        }, () => {
            done([])
        })
    } else {
        done([])
    }
};

const getStationsBoardData = (from, done) => {
    if (from === '') {
        done([])
    } else {
        getStationsBoard(from, (arr) => {
            done(arr)
        }, () => {
            done([])
        })
    }
};

const columns = [
    {
        name: 'To',
        selector: row => row.to,
    },
    {
        name: 'Time',
        selector: row => row.departure,
    },
    {
        name: 'Delay',
        selector: row => row.delay,
    },
    {
        name: 'Name',
        selector: row => row.label,
    },
];

class Stations extends React.Component {
    constructor() {
        super();

        this.state = {
            data: []
        };
    }

    mapOptionsToValues = options => {
        return options.map(option => ({
            value: option.id,
            label: option.name
        }));
    };

    getOptions = (inputValue, callback) => {
        if (!inputValue) {
            return callback([]);
        }
        getSuggestions(inputValue, (data) => {
            if (this.props.mapOptionsToValues)
                callback(data);
            else callback(data);
        })
    };

    getOptionValue = (option) => {
        return option.value;
    }

    getOptionLabel = (option) => {
        return option.label;
    }

    insertData = (newValue) => {
        this.setState({ data: newValue });
    };

    render() {
        const { data } = this.state;

        const findNextTrain = (e) => {
            e.preventDefault();
            const from = this.refs.from.getValue()[0]
            if (from !== '' && from !== null && from !== undefined) {
                getStationsBoardData(from.value, (data) => {
                    this.insertData(data)
                }, (data) => {
                    this.insertData(data)
                })
            }
        }

        return (
            <Wrapper>
                <div className="Stations">
                    <h2>See next trains</h2>
                    <div className="selectFrom">
                        <div>Station:</div>
                        <AsyncSelect
                            ref='from'
                            cacheOptions
                            loadOptions={this.getOptions}
                            getOptionValue={this.getOptionValue}
                            getOptionLabel={this.getOptionLabel}
                            defaultOptions
                            onInputChange={this.handleInputChange}
                        />
                    </div>
                    <button className="" onClick={findNextTrain}>
                        Find
                    </button>
                    <DataTable
                        columns={columns}
                        data={data}
                        noDataComponent={""}
                        striped="true"
                    />
                </div>
            </Wrapper>
        );
    }
}
export default Stations;
