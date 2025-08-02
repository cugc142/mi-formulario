import React, { useState } from 'react';
import './App.css'; // Importamos los estilos

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    favoriteSport: 'basketball',
    gender: 'not sure',
    stateResident: 'Kansas',
    is21orOlder: false,
    carModels: {
      Ford: false,
      Chrysler: false,
      Toyota: false,
      Nissan: false,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleCarCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      carModels: {
        ...prevState.carModels,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Enviando datos:', formData);

    try {
      const response = await fetch('http://localhost:5000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setFormData({
            firstName: '',
            lastName: '',
            favoriteSport: 'basketball',
            gender: 'not sure',
            stateResident: 'Kansas',
            is21orOlder: false,
            carModels: { Ford: false, Chrysler: false, Toyota: false, Nissan: false }
        });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>Update Information</h1>
        <p>Use the form below to edit your information.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="favoriteSport">Favorite sport:</label>
              <select
                id="favoriteSport"
                name="favoriteSport"
                value={formData.favoriteSport}
                onChange={handleChange}
              >
                <option value="basketball">Basketball</option>
                <option value="soccer">Soccer</option>
                <option value="baseball">Baseball</option>
                <option value="tennis">Tennis</option>
              </select>
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                  /> Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                  /> Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="not sure"
                    checked={formData.gender === 'not sure'}
                    onChange={handleChange}
                  /> Not sure
                </label>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stateResident">State resident:</label>
              <select
                id="stateResident"
                name="stateResident"
                value={formData.stateResident}
                onChange={handleChange}
              >
                <option value="Kansas">Kansas</option>
                <option value="Missouri">Missouri</option>
                <option value="Texas">Texas</option>
                <option value="California">California</option>
              </select>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="is21orOlder"
                  checked={formData.is21orOlder}
                  onChange={handleCheckboxChange}
                /> 21 or older
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Car models owned:</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="Ford"
                    checked={formData.carModels.Ford}
                    onChange={handleCarCheckboxChange}
                  /> Ford
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Chrysler"
                    checked={formData.carModels.Chrysler}
                    onChange={handleCarCheckboxChange}
                  /> Chrysler
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Toyota"
                    checked={formData.carModels.Toyota}
                    onChange={handleCarCheckboxChange}
                  /> Toyota
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Nissan"
                    checked={formData.carModels.Nissan}
                    onChange={handleCarCheckboxChange}
                  /> Nissan
                </label>
              </div>
            </div>
          </div>
          <button type="submit" className="save-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default App;