const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const zod = require('zod');
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const { createClient } = require('@supabase/supabase-js');


const PORT = 5000;
app.use(express.json());

const supabaseUrl = 'https://bftorftuikhjieuanqxm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmdG9yZnR1aWtoamlldWFucXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDAxNzcsImV4cCI6MjA2MjExNjE3N30.Hptl_Zwh-jZx2owv3y-9f5SzqhgzF5XWlLCvjcvGVmo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

app.post('/bookings', async (req, res) => {
  try {
    const { user_id, provider_id, slot_id } = req.body;

    const { data: existingBooking, error: existingBookingError } = await supabase
      .from('appointments')
      .select('*')
      .eq('provider_id', provider_id)
      .eq('slot_id', slot_id);

    if (existingBookingError) {
      return res.status(500).json({ error: existingBookingError.message });
    }

    if (existingBooking.length > 0) {
      console.log("Slot already booked:", existingBooking);
      return res.status(400).json({ error: 'Time slot already booked' });
    }

    const { data:appointment_id, error } = await supabase
      .from('appointments')
      .insert([
        {
          user_id: user_id,
          provider_id: provider_id,
          slot_id: slot_id,
          status: 'upcoming',
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Booking created successfully',
      appointment_id: appointment_id.id,
     });

  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
});

app.post('/reschedule', async (req, res) => {
    const { appointment_id, new_slot_id } = req.body;
    const {data:existingBooking, error: existingBookingError} = await supabase
        .from('appointments')
        .select('*')
        .eq('slot_id', new_slot_id)
    if(existingBookingError) {
        return res.status(500).json({ error: existingBookingError.message });
    }
    if(existingBooking.length > 0) {
        return res.status(400).json({ error: 'Time slot already booked' });
    }
    const { data, error } = await supabase
        .from('appointments')
        .update({ slot_id: new_slot_id })
        .eq('id', appointment_id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ message: 'Booking rescheduled successfully' });
})

app.post('/cancel', async (req, res) => {
    const {appointment_id}=req.body;
    const {data,error}=await supabase
    .from('appointments')
    .delete()
    .eq('id', appointment_id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ message: 'Booking cancelled successfully' });
})

app.post("/signup", async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
      return res.status(400).json({ error: "All fields are required" });
  }

  const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

  if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: "User already exists" });
  }

  const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, role }])
      .select(); 

  if (error) {
      console.log('Error inserting user:', error.message);
      return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
      console.log('Error: User data not returned');
      return res.status(500).json({ error: 'Error: User data not returned' });
  }
  res.status(200).json({ message: "User created successfully", user: data[0] });
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      console.log("Login successful");
      res.status(200).json({ message: "Login successful" ,
        name: existingUser.name
      });
    } else {
      console.log("Login failed: User not found");
      res.status(400).json({ error: "Login failed: User not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

app.post("/join",async(req,res)=>{
  const {user_id,provider_id}=req.body;
  const {data,error}=await supabase
  .from('queue')
  .insert([{
    user_id,provider_id,status:'waiting'
  }])
  .select();
  res.status(200).json({message:'You have joined the queue successfully',queue_id:data[0].id});
  if(error){
    console.error("Supabase insert error:", error);
    return res.status(500).json({error:error.message});
  }
});

app.get("/appointments", async (req, res) => {
  const { status, provider_id } = req.query;
  let appointments = supabase.from('appointments').select('*');
  if (status) appointments = appointments.eq('status', status);
  if (provider_id) appointments = appointments.eq('provider_id', provider_id);
  const { data, error } = await appointments;
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'No appointments found' });
  }
  return res.status(200).json(data);
});

app.patch("/update",async(req,res)=>{
  const {appointment_id,status}=req.body;
  const {data,error}=await supabase
  .from('appointments')
  .update({status})
  .eq('id',appointment_id)
  if(error){
    return res.status(500).json({error:error.message});
  }
  return res.status(200).json({ message: 'Status updated successfully' });
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
