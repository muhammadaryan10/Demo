const express = require("express");
const app =express();
const mongoose=require("mongoose");
app.use(express.json());
const router = express.Router();
const multer = require('multer');
const csvtojson = require('csvtojson');
const cors = require("cors");
const Student = require('./Models/studentmodel'); 
const port = 3000;

app.use(cors());


mongoose.connect('mongodb+srv://aryan:aryan7786@atlascluster.hgq93we.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    console.log("db connected")}) .catch((err)=>console.log("no connected"))


    
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });
    
    app.post('/upload', upload.single('file'), async (req, res) => {
      console.log("here");
      try {
        console.log("here i am ");
        const buffer = req.file.buffer.toString(); // Convert the uploaded file buffer to a string
        const jsonArray = await csvtojson().fromString(buffer); // Parse CSV to JSON
        console.log("here i am now ");
        // Save JSON data to MongoDB using your Student model
        await Student.insertMany(jsonArray);
        res.status(200).send('CSV data has been successfully uploaded to MongoDB.');
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while uploading CSV data.');
      }
    });
    app.get('/Studentdata', async (req, res) => {
      try {
        const data = await Student.find({}); 
        res.json(data); 
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching data from MongoDB.');
      }
    });   
    app.delete('/:id', async (req, res) => {
      const userId = req.params.id;
    
      try {
        const deletedUser = await Student.findByIdAndDelete(userId);
    
        if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        return res.status(204).json(); // Successfully deleted, no content
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
      }
    });
    app.post('/AddNewStudent',async(req,res)=>{
console.log("=====student===")
      const {name,email,phone}=req.body;
  
      try {
          const userData=await Student.create({
              name : name,
              email:email,
              phone: phone,
          })
          res.status(201).json(userData)
      } catch (error) {
          res.status(401);
      }
     
  
  })
  // Update a student by ID
app.put('/UpdateStudent/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    // Find the student by ID in your MongoDB database
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update the student's data
    student.name = name;
    student.email = email;
    student.phone = phone;

    // Save the updated student data
    await student.save();

    return res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while updating the student' });
  }
});

 app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });