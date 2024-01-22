const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { v4: uuidv4 } = require("uuid");
const app = express();

const dbPath = path.join(__dirname, "hostel.db");
let db = null;
app.use(cors());
app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(8000, () => {
      console.log("Server running at http://localhost:8000");
    });
    const password = "admin1";
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateQuery = `update main_admin set password='${hashedPassword}' where email="admin1@anurag.edu.in"`;
    await db.run(updateQuery);
    await db.run(`PRAGMA foreign_keys=1;`);
  } catch (e) {
    console.log(`DataBase Error ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const authenticateToken = (request, response, next) => {
  let jwt_token;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwt_token = authHeader.split(" ")[1];
  }
  if (jwt_token === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwt_token, "21eg112b31", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        next();
      }
    });
  }
};

app.post("/login/main-admin/", async (request, response) => {
  const { email, password } = request.body;
  const checkUser = `select * from main_admin where email='${email}';`;
  const dbUserExist = await db.get(checkUser);
  if (dbUserExist !== undefined) {
    const checkPassword = await bcrypt.compare(password, dbUserExist.password);
    if (checkPassword === true) {
      const payload = { email: email };
      const jwt_token = jwt.sign(payload, "21eg112b31");
      response.send({ jwt_token });
    } else {
      response.status(400);
      response.send({ error_msg: "Wrong Password" });
    }
  } else {
    response.status(401);
    response.send({ error_msg: "Invalid Email Id" });
  }
});

app.post("floor-data/add/floor/:hostelType", async (request, response) => {
  const { floorNo, numberOfRooms } = request.body;
  const checkFloorQuery = `select * from floor where floor_no=${floorNo}`;
  const dbFloorExist = await db.get(checkFloorQuery);
  if (dbFloorExist === undefined) {
    const total_students = 0,
      present_students = 0,
      available_students = 0,
      id = uuidv4(),
      hostel_type = "boys";
    const addFloorQuery = `insert into floor 
        (id,floor_no,no_of_rooms,total_students,present_students,available_students,hostel_type)
        values ('${id}',${floorNo},${numberOfRooms},${total_students},${present_students},${available_students},'${hostel_type}');`;
    await db.run(addFloorQuery);
    response.send("Success");
  } else {
    response.status(400);
    response.send({ error_msg: "Floor already exits" });
  }
});

app.get("/floor-data/:hostelType", async (request, response) => {
  const hostelType=request.params
  console.log(hostelType)
  const getFloorQuery = `select * from floor where hostel_type='boys';`;
  const floorDetails = await db.all(getFloorQuery);
  response.send(floorDetails);
});

app.delete("floor-data/delete/:hostelType/:deleteId", async (request, response) => {
  const { deleteId } = request.params;
  const deleteFloorQuery = `delete from floor where id='${deleteId}'`;
  await db.run(deleteFloorQuery);
  response.send("Success");
});

app.post("room-data/add/room/:hostelType", async (request, response) => {
  const { roomNo, floorNo, totalStudents, roomType, washroomType } =
    request.body;
  const checkRoomNo = `select * from room where room_no=${roomNo} and floor_no=${floorNo} and hostel_type='boys'`;
  const dbExistRoom = await db.get(checkRoomNo);
  if (dbExistRoom === undefined) {
    const getFloorIdQuery = await db.get(
      `select id from floor where floor_no=${floorNo} and hostel_type='boys'`,
    );
    if (getFloorIdQuery === undefined) {
      response.status(400);
      response.send({
        error_msg: "Floor doesn't exist! Please create a floor",
      });
    } else {
      const floor_id = getFloorIdQuery.id;
      const present_students = 0,
        available_students = 0,
        id = uuidv4(),
        hostel_type = "boys";
      const createRoomQuery = `insert into room (id,room_no,floor_no,hostel_type,total_students,present_students,available_students,room_type,washroom_type,floor_id) values('${id}',${roomNo},${floorNo},'${hostel_type}',${totalStudents},${present_students},${available_students},'${roomType}','${washroomType}','${floor_id}');`;
      await db.run(createRoomQuery);
      response.send("Success");
    }
  } else {
    response.status(400);
    response.send({ error_msg: "Room Already Exits! Please check" });
  }
});

app.get("room-data/:hostelType", async (request, response) => {
  const getRoomDetailQuery = `select * from room where hostel_type='boys';`;
  const getDetails = await db.all(getRoomDetailQuery);
  response.send(getDetails);
});

app.delete("room-data/delete/:hostelType/:roomId", async (request, response) => {
  const { roomId } = request.params;
  const deleteRoomQuery = `delete from room where id='${roomId}';`;
  await db.run(deleteRoomQuery);
  response.send("Successfully Deleted");
});
