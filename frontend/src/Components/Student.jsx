import React, { useState, useEffect } from 'react';

function Student() {
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showeditPopup, setShoweditPopup] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [editStudent, setEditStudent] = useState({
    _id: "", // Add an ID field to track the student being edited
    name: "",
    email: "",
    phone: "",
  });

  const editPopupOpen = (student) => {
    setEditStudent({ ...student });
    setShoweditPopup(true);
    
  };

  const editPopupClose = () => {
    setShoweditPopup(false);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  async function fetchData() {
    const response = await fetch("https://demo-git-main-muhammadaryan10.vercel.app/Studentdata");
    const result = await response.json();
    if (response.ok) {
      setData(result);
    } else {
      console.log("Fetch failed");
    }
  }

  let value, name;
  const getUserdata = (e) => {
    name = e.target.name;
    value = e.target.value;
    if (showeditPopup) {
      // If editing, update the editStudent state
      setEditStudent({ ...editStudent, [name]: value });
    } else {
      // If adding, update the newStudent state
      setNewStudent({ ...newStudent, [name]: value });
    }
    console.log(newStudent);
  };

  
  const deleteData = async (id) => {
    console.log(id , "====  deleteData ====");
    const response = await fetch(`https://demo-git-main-muhammadaryan10.vercel.app/${id}`,{
      method: 'DELETE',
    });
    console.log(response?.url,"====== response =====");
    if (response.ok) {
      console.log("Delete successful");
      fetchData(); // Fetch data after successful deletion
    } else {
      console.log("Delete failed");
    }
  }

  const sendData = async (e) => {
    e.preventDefault();
    const { name, email, phone } = newStudent;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
      }),
    };
    if (name && email && phone) {
      console.log("Options:", options);
      const response = await fetch(
        "https://demo-git-main-muhammadaryan10.vercel.app/AddNewStudent",
        options
      );
      console.log("Response:", response);
      if (response) {
        setNewStudent({
          name: "",
          email: "",
          phone: "",
        });
        alert("your response has been recorded");
        setShowPopup(false);
      }
    } else {
      alert("Response not recorded");
    }
  };

  const updateData = async () => {
    const { _id, name, email, phone } = editStudent;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
      }),
    };
    if (_id && name && email && phone) {
      const response = await fetch(`https://demo-git-main-muhammadaryan10.vercel.app/UpdateStudent/${_id}`, options);
      if (response.ok) {
        fetchData(); // Fetch updated data
        setShoweditPopup(false); // Close the edit popup
      }
    } else {
      alert("Invalid data for update");
    }
  };

  useEffect(() => {
    fetchData()
  }, [sendData,deleteData
  ]);

  return (
    <div>

        {showPopup && (
    <div className="overlay">
      <div className="popup">
        <h2>Adding New Student </h2>
        <form onSubmit={sendData}>
          {/* Your form elements go here */}
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required onChange={getUserdata} />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required onChange={getUserdata}/>
          <label htmlFor="Phone">Phone</label>
          <input type="number" id="phone" name="phone" pattern="[0-9]*" required onChange={getUserdata}/>
          <button type="submit">Submit</button>
        </form>
        <button onClick={handleClosePopup}>Close</button>
      </div>
    </div>
  )}
       {showeditPopup && (
    <div className="overlay">
      <div className="popup">
        <h2> Update Stuudent Data </h2>
        <form onSubmit={updateData}>
          {/* Your form elements go here */}
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required onChange={getUserdata} value={editStudent.name} />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required onChange={getUserdata} value={editStudent.email}/>
          <label htmlFor="Phone">Phone</label>
          <input type="number" id="phone" name="phone" pattern="[0-9]*" required onChange={getUserdata} value={editStudent.phone}/>
          <button type="submit">Submit</button>
        </form>
        <button onClick={editPopupClose}>Close</button>
      </div>
    </div>
  )}

  <div className="col-12 mt-2">
  <h1>CSV Data from MongoDB</h1>
  <button onClick={handleOpenPopup}>Add New Student</button>
  <table className="table my-2 table-bordered">
    <thead>
      <tr>
        <th scope="col" style={{ alignSelf: "center" }}>Name</th>
        <th scope="col" style={{ alignSelf: "center" }}>E-Mail</th>
        <th scope="col" style={{ alignSelf: "center" }}>Phone</th>
        <th scope="col" style={{ alignSelf: "center" }}>Actions</th>
      </tr>
    </thead>
    <tbody >
  {data.map((element) => (
  <tr key={element.id}>
  <td>
  {element.name}
  </td>
  <td >
    {element.email}
  </td>
  <td >
    {element.phone}
  </td>
  <td className='d-flex justify-content-center '>
    <button className="d-block btn btn-danger mx-3 " onClick={() => deleteData(element._id)}>Remove</button>
    <button className="d-block btn btn-success mx-3 " onClick={() => editPopupOpen(element)}>Edit</button>
  </td>
</tr>
  ))}
  </tbody>
  </table>
  </div>
  </div>
  );
}

export default Student;
