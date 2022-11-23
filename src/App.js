import React, { useEffect, useState } from 'react'
import '../src/App.css'

function App() {
  const [cars, setCars] = useState(null)
  const [carId, setCarId] = useState(null)
  const [updating, setUpdating] = useState(false)

  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [model, setModel] = useState('')

  useEffect(() => {
    fetch('/api/cars')
      .then((res) => res.json())
      .then((json) => setCars(json.cars))
      .catch((err) => console.log(err))
  }, [])

  const createCar = async () => {   // function to create cars 
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        body: JSON.stringify({ name, year, model}),
      })
      const json = await res.json()

      setCars([...cars, json.car])   // this will set the name back to an empty string
      setName('')
      setYear('')
      setModel('')
    } catch (err) {
      console.log(err)
    }
  }

  const updateCar = async () => {        // this is the function that creates the car that I send over to server 
    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, year, model }),
      })
      const json = await res.json()

      const carsCopy = [...cars]
      const index = cars.findIndex((m) => m.id === carId)
      carsCopy[index] = json.car

      setCars(carsCopy)
      setName('')
      setYear('')
      setModel('')
      setUpdating(false)
      setCarId(null)
    } catch (err) {
      console.log(err)
    }
  }

  const submitForm = async (event) => {     // submit the form function s
    event.preventDefault()

    if (updating) {
      updateCar()
    } else {
      createCar()
    }
  }

  const deleteCar = async (id) => {
    try {
      await fetch(`/api/cars/${id}`, { method: 'DELETE' })

      setCars(cars.filter((m) => m.id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  const setCarToUpdate = (id) => {
    const car = cars.find((m) => m.id === id)
    if (!car) return
    setUpdating(true)
    setCarId(car.id)
    setName(car.name)
    setYear(car.year)
    setModel(car.model)

  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col">
          <h1 className="fw-normal text-center my-3">Best Cars</h1>
          <div className="my-4">
            <form onSubmit={submitForm}>
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Brand"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <div className="col-2">
                  <button type="submit" className="btn" id='button'>
                    {updating ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </form>
          </div>
          {cars?.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Brand</th>
                  <th>Year</th>
                  <th>Model</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cars.map(({ id, name, year, model }) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{year}</td>
                    <td>{model}</td>
                    <td>
                      <button
                        className="btn btn-warning me-3"
                        onClick={() => setCarToUpdate(id)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteCar(id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : cars ? (
            <p>No Cars</p>
          ) : (
            <p>Loading..</p>
          )}
        </div>
      </div>
          </div>
  )
}

export default App