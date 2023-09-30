import React, { useState } from 'react';

function Upload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!file) {
      alert('Please select a CSV file');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    fetch('https://demo-git-main-muhammadaryan10.vercel.app/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text(); // Parse response as text
        } else {
          throw new Error('File upload failed'); // Handle failure
        }
      })
      .then((data) => {
        console.log('Data:', data); // Log the CSV data
        alert('File successfully uploaded');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while uploading the CSV file.');
      });
  };
  

  return (
    <div>
      <h1 className='my-4'>Upload a CSV File</h1>
      <form  encType="multipart/form-data my-3">
        <input type="file" name="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Upload</button>
      </form>
    </div>
  );
}

export default Upload;
