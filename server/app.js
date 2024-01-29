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
    const updateQuery = `update admin set password='${hashedPassword}' where email="admin1@anurag.edu.in"`;
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
  const { email, password, role } = request.body;
  const checkUser = `select * from admin where email='${email}' and role='${role}';`;
  const dbUserExist = await db.get(checkUser);
  if (dbUserExist !== undefined) {
    const checkPassword = await bcrypt.compare(password, dbUserExist.password);
    if (checkPassword === true) {
      const payload = { email: email };
      const jwt_token = jwt.sign(payload, "21eg112b31");
      response.send({ jwt_token });
    } else {
      response.status(401);
      response.send({ error_msg: "Wrong Password" });
    }
  } else {
    response.status(401);
    response.send({
      error_msg: "Invalid Email Id or Invalid Role. Please Check to Continue",
    });
  }
});

app.post("/add/admin/data", async (request, response) => {
  const { email, password, admin_type, hostel_type } = request.body;
  const checkAdminQuery = `select * from admin where email='${email}' and role='${admin_type}'`;
  const checkAdmin = await db.get(checkAdminQuery);
  if (checkAdmin === undefined) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertAdminQuery = `insert into admin (email,password,role,hostel_type) values('${email}', '${hashedPassword}', '${admin_type}', '${hostel_type}')`;
    await db.run(insertAdminQuery);
    response.send("success");
  } else {
    response.send({ error_msg: "Email already exits" });
  }
});

app.post("/floor-data/add/floor/:hostelType", async (request, response) => {
  const { hostelType } = request.params;
  const { floorNo } = request.body;
  const checkFloorQuery = `select * from floor where floor_no=${floorNo} and hostel_type='${hostelType}'`;
  const dbFloorExist = await db.get(checkFloorQuery);
  if (dbFloorExist === undefined) {
    const total_students = 0,
      present_students = 0,
      available_students = 0,
      no_of_rooms = 0,
      id = uuidv4();
    const addFloorQuery = `insert into floor 
        (id,floor_no,no_of_rooms,total_students,present_students,available_students,hostel_type)
        values ('${id}',${floorNo},${no_of_rooms},${total_students},${present_students},${available_students},'${hostelType}');`;
    await db.run(addFloorQuery);
    response.send({ message: "Success" });
  } else {
    response.status(400);
    response.send({ error_msg: "Floor already exits" });
  }
});

app.get("/floor-data/:hostelType", async (request, response) => {
  const { hostelType } = request.params;
  const getFloorQuery = `select * from floor where hostel_type='${hostelType}' order by floor_no ASC;`;
  const floorDetails = await db.all(getFloorQuery);
  response.send({ floorDetails });
});

app.delete(
  "/floor-data/delete/:hostelType/:deleteId",
  async (request, response) => {
    const { hostelType, deleteId } = request.params;
    const deleteFloorQuery = `delete from floor where id='${deleteId}' and hostel_type='${hostelType}'`;
    await db.run(deleteFloorQuery);
    response.send("Success");
  },
);

app.post("/room-data/add/room/:hostelType", async (request, response) => {
  const { hostelType } = request.params;
  const { roomNo, floorNo, total, roomType, washroomType } = request.body;

  const getFloorIdQuery = await db.get(
    `select id from floor where floor_no=${floorNo} and hostel_type='${hostelType}'`,
  );
  if (getFloorIdQuery !== undefined) {
    const checkRoomNo = `select * from room where room_no=${roomNo} and floor_no=${floorNo} and hostel_type='${hostelType}'`;
    const dbExistRoom = await db.get(checkRoomNo);
    if (dbExistRoom === undefined) {
      const floor_id = getFloorIdQuery.id;
      const present_students = 0,
        id = uuidv4();
      const createRoomQuery = `insert into room (id,room_no,floor_no,hostel_type,total_students,present_students,available_students,room_type,washroom_type,floor_id) values('${id}',${roomNo},${floorNo},'${hostelType}',${total},${present_students},${total},'${roomType}','${washroomType}','${floor_id}');`;
      await db.run(createRoomQuery);
      response.send("Success");
      const rows = await db.all(`select id from floor`);
      for (const each_floor of rows) {
        const id = each_floor.id;
        const countQuery = await db.all(
          `select count(room.id) as count, sum(room.total_students) as total, sum(room.available_students) as available from room inner join floor on room.floor_id=floor.id where room.floor_id='${id}'`,
        );
        const countRoom = countQuery[0].count;
        let countTotal = countQuery[0].total;
        let available = countQuery[0].available;
        if (countTotal === null) {
          countTotal = 0;
        }
        if (available === null) {
          available = 0;
        }
        await db.run(
          `update floor set no_of_rooms=${countRoom}, total_students=${countTotal}, available_students=${available} where id='${id}' `,
        );
      }
    } else {
      response.status(400);
      response.send({ error_msg: "Room Already Exits! Please check" });
    }
  } else {
    response.status(400);
    response.send({
      error_msg: "Floor doesn't exist! Please create a floor",
    });
  }
});

app.get("/room-data/:hostelType", async (request, response) => {
  const { hostelType } = request.params;
  const { room_type, washroom_type } = request.query;
  let filterRoomQuery, filterWashroomQuery;
  if (room_type === "") {
    filterRoomQuery = `room_type LIKE '%${room_type}%'`;
  } else {
    filterRoomQuery = `room_type='${room_type}'`;
  }
  if (washroom_type === "") {
    filterWashroomQuery = `washroom_type LIKE '%${washroom_type}%'`;
  } else {
    filterWashroomQuery = `washroom_type='${washroom_type}'`;
  }
  const getRoomDetailQuery = `select * from room where hostel_type='${hostelType}' and ${filterRoomQuery} and ${filterWashroomQuery} order by floor_no ASC, room_no ASC ;`;
  const getDetails = await db.all(getRoomDetailQuery);
  response.send({ roomData: getDetails });
});

app.delete(
  "/room-data/delete/:hostelType/:roomId",
  async (request, response) => {
    const { hostelType, roomId } = request.params;
    const deleteRoomQuery = `delete from room where id='${roomId}' and hostel_type='${hostelType}';`;
    await db.run(deleteRoomQuery);
    response.send("Successfully Deleted");
    const rows = await db.all(`select id from floor`);
    for (const each_floor of rows) {
      const id = each_floor.id;
      const countQuery = await db.all(
        `select count(room.id) as count, sum(room.total_students) as total, sum(room.available_students) as available from room inner join floor on room.floor_id=floor.id where room.floor_id='${id}'`,
      );
      const countRoom = countQuery[0].count;
      let countTotal = countQuery[0].total;
      let available = countQuery[0].available;
      if (countTotal === null) {
        countTotal = 0;
      }
      if (available === null) {
        available = 0;
      }
      await db.run(
        `update floor set no_of_rooms=${countRoom}, total_students=${countTotal}, available_students=${available} where id='${id}' `,
      );
    }
  },
);

app.post("/student-data/add/student/:hostelType", async (request, response) => {
  const { hostelType } = request.params;
  const {
    name,
    hallTicket_number,
    branch,
    current_year,
    room_no,
    gender,
    mobile_number,
  } = request.body;
  const checkStudentQuery = `select * from student where hall_ticket_number='${hallTicket_number}'`;
  const checkStudent = await db.get(checkStudentQuery);
  if (checkStudent === undefined) {
    const checkRoomQuery = `select * from room where room_no=${room_no} and hostel_type='${hostelType}'`;
    const checkRoom = await db.get(checkRoomQuery);
    if (checkRoom !== undefined) {
      const room_id = checkRoom.id;
      const floor_id = checkRoom.floor_id;
      if (floor_id !== undefined) {
        const roomDetailQuery = `select total_students as total, present_students as present from room where id='${room_id}'`;
        const roomDetail = await db.get(roomDetailQuery);
        const total = roomDetail.total;
        const present = roomDetail.present;
        if (present < total) {
          const id = uuidv4();
          const addStudentQuery = `insert into student
        (id,student_name,hall_ticket_number,branch,current_year,room_no,gender,mobile_number,room_id,floor_id, hostel_type)
        values('${id}', '${name}', '${hallTicket_number}', '${branch}', ${current_year}, ${room_no}, '${gender}', ${mobile_number}, '${room_id}','${floor_id}', '${hostelType}')
        `;
          await db.run(addStudentQuery);
          response.send("Success");
          const countQuery = `select count(id) as total from student where room_id='${room_id}'`;
          const count = await db.get(countQuery);
          const totalPresent = count.total;
          const available = total - totalPresent;
          const updateRoomDetailQuery = `update room set available_students=${available}, present_students=${totalPresent} where id='${room_id}';`;
          await db.run(updateRoomDetailQuery);
          const rows = await db.all(`select id from floor`);
          for (const each_floor of rows) {
            const id = each_floor.id;
            const countQuery = await db.all(
              `select count(room.id) as count, sum(room.total_students) as total, sum(room.available_students) as available, sum(room.present_students)as present from room inner join floor on room.floor_id=floor.id where room.floor_id='${id}'`,
            );
            const countRoom = countQuery[0].count;
            let countTotal = countQuery[0].total;
            let available = countQuery[0].available;
            let present = countQuery[0].present;
            if (countTotal === null) {
              countTotal = 0;
            }
            if (available === null) {
              available = 0;
            }
            if (present === null) {
              present = 0;
            }
            await db.run(
              `update floor set no_of_rooms=${countRoom}, total_students=${countTotal}, available_students=${available},present_students=${present} where id='${id}' `,
            );
          }
        } else {
          response.status(401);
          response.send({
            error_msg: "Room Capacity full! Please select another room",
          });
        }
      } else {
        response.status(401);
        response.send({ error_msg: "Floor doesn't exist! Please check" });
      }
    } else {
      response.status(401);
      response.send({ error_msg: "Room Doesn't exist! Please check" });
    }
  } else {
    response.status(401);
    response.send({ error_msg: "Student Already Exist! Please check" });
  }
});

app.get("/student-data/:hostelType", async (request, response) => {
  const { hostelType } = request.params;
  const getStudentDetailsQuery = `select * from student where hostel_type='${hostelType}'`;
  const getsStudentDetails = await db.all(getStudentDetailsQuery);
  response.send(getsStudentDetails);
});

app.delete(
  "/student-data/delete/student/:studentId",
  async (request, response) => {
    const { hostelType, studentId } = request.params;
    const roomIdQuery = `select room_id from student where id='${studentId}'`;
    const roomId = await db.get(roomIdQuery);
    const room_id = roomId.room_id;
    const totalCapacityQuery = `select total_students as total from room where id='${room_id}'`;
    const totalCapacity = await db.get(totalCapacityQuery);
    const capacity = totalCapacity.total;
    const deleteQuery = `delete from student where id='${studentId}'`;
    await db.run(deleteQuery);
    response.send("Deleted");
    const countQuery = `select count(id) as total from student where room_id='${room_id}'`;
    const count = await db.get(countQuery);
    const totalPresent = count.total;
    const available = capacity - totalPresent;
    const updateRoomDetailQuery = `update room set available_students=${available}, present_students=${totalPresent} where id='${room_id}';`;
    await db.run(updateRoomDetailQuery);
  },
);
