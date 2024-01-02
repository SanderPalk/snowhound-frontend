import "../../App.css"
import {useEffect, useState} from "react";
import axios from "axios";
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import {Popup, Select} from '@mobiscroll/react';

function AddMovie() {
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isPopupOpen, setOpen] = useState(false)

  const [name, setName] = useState('')
  const [rating, setRating] = useState(0.0)
  const [year, setYear] = useState(Number(new Date().getFullYear()))
  const [eidr, setEidr] = useState('')
  const [status, setStatus] = useState(false)

  function mapCategories() {
    // const newArray = categories.map((item) => ({text: item.name, value: item.id}));
    return categories.map((category) => ({value: category.id, text: category.name}));
  }

  useEffect(() => {
    getCategories()
    mapCategories()
  });

  function getCategories() {
    axios.get(process.env.REACT_APP_API_URL + '/api/categories')
        .then((response) => {
          setCategories(response.data)
        })
        .catch((e) => console.log(e))
  }

  function validations() {
    if (name === ''){
      setErrorMessage("The name is empty")
      return false
    }
    if (eidr === '')
    {
      setErrorMessage("The EIDR code is empty")
      return false
    }
    if (selectedCategories === []) {
      setErrorMessage("No categories selected")
      return false
    }
    if (year > new Date().getFullYear() || year < 1888) {
      setErrorMessage("Incorrect year")
      return false
    }
    if (rating > 10 || rating < 0) {
      setErrorMessage("Incorrect rating")
      return false
    }
    setErrorMessage("")
    return true;
  }

  function clearFormData() {
    setName('')
    setRating(0.0)
    setYear(Number(new Date().getFullYear()))
    setEidr('')
    setSelectedCategories([])
    setStatus(false)
  }

  function saveMovie() {

    if (!validations()) {
      return;
    }
    const moveData = {
      name: name,
      eidr: eidr,
      year: year,
      status: status,
      rating: rating,
      categories: selectedCategories
    }
    axios.post(process.env.REACT_APP_API_URL + "/api/movies", moveData)
        .then((response) => {
          setOpen(true)
          clearFormData()
          console.log("New movie added")
        })
        .catch((error) => {
          if (error.response.status === 409 || error.response.status === 400) {
            console.log(error)
            setErrorMessage(error.response.data.message)
          }
        })
  }

  return (
      <div className="App">
        <div className="w-75 m-auto">
          <h3 className="text-start">Add movie</h3>
          {errorMessage !== '' &&
              <p className="alert alert-danger">{errorMessage}</p>
          }
          <div className="d-flex flex-column text-start">
            <div className="form-group m-3">
              <label htmlFor="name">Movie name:</label>
              <input className="form-control" placeholder="Insert the movie name..." type="text" id="name" value={name}
                     onChange={(e) => setName(e.target.value)}/>
            </div>



            <div className="form-group m-3">
              <label htmlFor="eidr">EIDR code:</label>
              <input className="form-control" type="text" id="eidr"
                     placeholder="10.5240/XXXX-XXXX-XXXX-XXXX-XXXX-C" value={eidr}
                     onChange={(e) => setEidr(e.target.value)}/>
            </div>

              <Select
                  data={mapCategories()}
                  onChange={(event) => setSelectedCategories(event.value)}
                  selectMultiple={true}
                  label="Categories"
                  inputStyle="box"
                  labelStyle="floating"
                  placeholder="Please select categories..."
                  value={selectedCategories}
                  theme="auto"
                  themeVariant="light"
              />

            <div className="form-group m-3">
              <label htmlFor="year">Movie release year:</label>
              <input className="form-control w-25" type="number" id="year" value={year}
                     onChange={(e) => setYear(e.target.value)}/>
            </div>

            <div className="form-group m-3">
              <label htmlFor="rating">Movie rating:</label>
              <input className="form-control" type="number" min={0} max={20} id="rating" step="0.1" maxLength="2"
                     value={rating}
                     onChange={(e) => e.target.value > 10 ? setRating(10) : e.target.value < 0 ? setRating(0) : setRating(e.target.value)}/>
            </div>

            <div className="form-group m-3">
              <label className="form-check-label" htmlFor="status">Movie status active:</label>
              <input className="form-check-input m-1" type="checkbox" id="status" value={status} onChange={(e) => setStatus(!status)}/>
            </div>

            <button className="btn btn-primary w-25" onClick={saveMovie}>Save Movie</button>
          </div>
        </div>

        <Popup isOpen={isPopupOpen} themeVariant={"light"} className="text-center">
          <h3 className="text-center align-self-center">New movie added</h3>
          <button onClick={(e) => {
            setOpen(false)
          }} className="btn btn-sm btn-outline-primary">Okay!
          </button>
        </Popup>
      </div>
  );
}

export default AddMovie;
