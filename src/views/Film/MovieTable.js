import "../../App.css"
import axios from "axios";
import {useEffect, useState} from "react";
import DataTable from 'react-data-table-component';
import {Popup, Select} from "@mobiscroll/react";

const movieColumns = [
  {
    id: 'id',
    selector: row => row.id,
    omit: true
  },
  {
    name: 'Name',
    selector: row => row.name,
    width: '20%',
    sortable: true,
  },
  {
    name: 'Rating',
    selector: row => row.rating,
    width: '10%',
    sortable: true,
  },
  {
    name: 'Year',
    selector: row => row.year,
    width: '10%'
  },
  {
    name: 'Categories',
    selector: row => row.categories.map(category => category.name).join(', '),
    width: '25%'
  },
  {
    name: 'EIDR',
    selector: row => row.eidr,
    width: '35%'
  },
]

const conditionalRowStyles = [
  {
    when: row => !row.status,
    style: {
      color: 'lightgray',
    },
  },
];

function MovieTable() {
  const [movieData, setMovieData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [isPopupOpen, setOpen] = useState(false)

  const [statusFilter, setStatusFilter] = useState(true);
  const [textFilter, setTextFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  function filterMovies() {
    let filterMovieData = movieData

    filterMovieData = filterByStatus(filterMovieData)
    filterMovieData = filterByText(filterMovieData)
    filterMovieData = filterByCategory(filterMovieData)
    return filterMovieData
  }

  function filterByStatus(items) {
    if (statusFilter === null) {
      return items
    }
    return items.filter(
      item => item.status === statusFilter);
  }

  function filterByText(items) {
    if (textFilter === '') {
      return items;
    }
    return items.filter(
      item => item.name.toLowerCase().includes(textFilter.toLowerCase()) || item.eidr.toLowerCase().includes(textFilter.toLowerCase()));
  }

  function filterByCategory(items) {
    if (categoryFilter === 'All') {
      return items
    }
    return items.filter(
      item => item.categories.map(category => category.name).includes(categoryFilter)
    )
  }

  useEffect(() => {
    fetchMovies()
  }, []);


  async function fetchMovies() {
    axios.get(process.env.REACT_APP_API_URL + '/api/movies')
    .then((response) => {
      setMovieData(response.data)
      setLoading(false)
    })
    .catch((error) => {
      setLoading(false)
      console.log(error)
    })
  }

  async function deleteMovies() {
    const selectedMovies = selectedRows.selectedRows

    selectedMovies.forEach(movie => {
      axios.delete(process.env.REACT_APP_API_URL + `/api/movies/${movie.id}`)
      .then((response) => {
        fetchMovies()
        setToggleCleared(true)
        setOpen(true)
      })
      .catch((error) => {
        console.log(error)
      })
    })
  }

  async function changeMovieStatus() {
    const selectedMovies = selectedRows.selectedRows

    selectedMovies.forEach(movie => {
      axios.put(process.env.REACT_APP_API_URL + `/api/movies/${movie.id}/status`, {status: !movie.status}) //
      .then((response) => {
        fetchMovies()
        setToggleCleared(!toggleCleared)
      })
      .catch((error) => {
        setToggleCleared(!toggleCleared)
        console.log(error)
      })
    })
  }


  function tableSubHeader() {
    const statusFilterData = [
      {value: true, text: 'Active'},
      {value: false, text: 'Inactive'},
      {value: null, text: 'All'}
    ]
    const movieCategoryData = [...new Set(movieData.flatMap(item => item.categories.map(category => category.name)))];
    movieCategoryData.push("All")

    return (
      <div className="w-100 d-flex flex-row justify-content-end">
        {selectedRows.selectedCount !== 0 &&
          <div className="w-25 text-start mt-3 d-flex flex-row align-items-center table-buttons m-1">
            <button onClick={deleteMovies} type="button" className="m-1 btn btn-danger btn-sm">Delete
              movies
            </button>
            <button onClick={changeMovieStatus} type="button" className="m-1 btn btn-warning btn-sm">Change status
            </button>
          </div>
        }

        <div className="w-25 text-start mt-3">
          <label>Search by name or EIDR:</label>
          <input className="form-control align-items-start" type={"text"}
                 onChange={(e) => setTextFilter(e.target.value)} value={textFilter}/>
        </div>

        <div className="w-25">
          <Select data={movieCategoryData} onChange={(event) => setCategoryFilter(event.value)}
                  value={categoryFilter}
                  themeVariant={"light"} label="Movie category" labelStyle="stacked"
                  inputStyle="box"></Select>
        </div>

        <div className="w-25">
          <Select data={statusFilterData} onChange={(event) => setStatusFilter(event.value)}
                  value={statusFilter}
                  themeVariant={"light"} label="Movie status" labelStyle="stacked" inputStyle="box"></Select>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <h3 className="text-start">Movie table</h3>
      <DataTable
        columns={movieColumns}
        data={filterMovies()}
        conditionalRowStyles={conditionalRowStyles}
        progressPending={loading}
        pagination
        subHeader
        subHeaderComponent={tableSubHeader()}
        selectableRows
        onSelectedRowsChange={(selectedRows) => setSelectedRows(selectedRows)}
        clearSelectedRows={toggleCleared}
      ></DataTable>

      <Popup isOpen={isPopupOpen} themeVariant={"light"} className="text-center">
        <h3 className="text-center align-self-center">Movies deleted!</h3>
        <button onClick={(e) => {
          setOpen(false)
        }} className="btn btn-sm btn-outline-primary">Okay!
        </button>
      </Popup>
    </div>
  );
}

export default MovieTable;
