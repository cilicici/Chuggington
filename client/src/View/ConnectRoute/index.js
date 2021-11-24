import Wrapper from '../Wrapper'
import React from 'react';
import AsyncSelect from 'react-select/async';
import DataTable from 'react-data-table-component';
import { getLocations, getConnections } from '../../lib/transport'


function transformToNewLine(items) {
  const arr = items.map(function (item) {
    return <p key={getKey()} className="multicell">{item}</p>
  })
  return <div className="">{arr}</div>

}

const columns = [
  {
    name: 'From',
    selector: row => row.from,
  },
  {
    name: 'To',
    selector: row => row.to,
  },
  {
    name: 'Transfer',
    selector: row => row.transfers,
    maxWidth: 100

  },
  {
    name: 'Start time(delay)',
    selector: row => row.startTime,
    cell: row => {
      return transformToNewLine(row.startTime)
    },
  },
  {
    name: 'End time(delay)',
    selector: row => row.endTime,
    cell: row => {
      return transformToNewLine(row.endTime)
    },
  },
  {
    name: 'Product',
    selector: row => row.product,
    cell: row => {
      return transformToNewLine(row.product)
    },
  },
  {
    name: 'Transfer stations',
    cell: row => {
      return transformToNewLine(row.interStations)
    },
  },
];
const findRouteAjax = (from, to, done) => {
  if (from === '' || to === '') {
    done()
  } else {
    getConnections(from, to, (arr) => {
      done(arr)
    }, () => {
      done()
    })
  }
};
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

let key = 0

function getKey() {
  return key++;
}

class ConnectRoute extends React.Component {
  constructor() {
    super();

    this.state = {
      data: []
    };
  }
  getOptions = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    }
    getSuggestions(inputValue, (data) => {
      callback(data);
    })
  };

  getOptionValue = (option) => {
    return option.value;
  }

  getOptionLabel = (option) => {
    return option.label;
  }

  getOptionsTo = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    }
    getSuggestions(inputValue, (data) => {
       callback(data);
    })
  };

  getOptionValueTo = (option) => {
    return option.value;
  }

  getOptionLabelTo = (option) => {
    return option.label;
  }

  insertData = (newValue) => {
    this.setState({ data: newValue });
  };

  render() {
    const { data } = this.state;


    const findRoute = (e) => {
      e.preventDefault();
      const from = this.refs.from.getValue()[0]
      const to = this.refs.to.getValue()[0]
      if (from !== '' && from !== null && from !== undefined && to !== '' && to !== null && to !== undefined) {
        findRouteAjax(from.value, to.value, (data) => {
          this.insertData(data)
        })
      }
    }

    return (
      <Wrapper>
        <div className="Stations">
          <h2>See route</h2>
          <div className="selectFrom">
            <div>From:</div>
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
          <div className="selectFrom">
            <div>To:</div>
            <AsyncSelect
              ref='to'
              cacheOptions
              loadOptions={this.getOptionsTo}
              getOptionValue={this.getOptionValueTo}
              getOptionLabel={this.getOptionLabelTo}
              defaultOptions
              onInputChange={this.handleInputChange}
            />
          </div>
          <button className="" onClick={findRoute}>
            Find
          </button>
          <DataTable
            columns={columns}
            data={data}
            noDataComponent={""}
            striped="true"
          />
        </div>
      </Wrapper >
    );
  }
}

export default ConnectRoute;
