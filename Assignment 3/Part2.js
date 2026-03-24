const http = require("node:http");
const fs = require("node:fs");
const port = 3000;
let user = [
  { id: 1, name: "John Doe" , email: "john@gmail.com" },
  { id: 2, name: "Ali Mohamed" , email: "ali@gmail.com" },
  { id: 3, name: "Sara Smith" , email: "sara@gmail.com" },
  { id: 4, name: "Ahmed Ali" , email: "ahmed@gmail.com" },
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  //Question 1 
  if (method === "POST" && url === "/user") {
    let body = "";
    req.on("data", (chunk) => {
        body+=chunk; });

    req.on("end", () => {
        const newUser = JSON.parse(body);
         const emailExists = user.find(u => u.email === newUser.email);
        if (emailExists) {
            res.writeHead(409, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Email already exists" }));
            return;
        }
        user.push(newUser);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User added successfully" }));
    });
  }
  //Question 2
  else if (method === "PATCH" && url.startsWith("/user/")) {
    const id = url.split("/")[2];
      const user_id=user.find(user => user.id===parseInt(id));
      if (!user_id) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
        return;
      } 
      
    let bodyy = "";
    req.on("data", (chunk) => {
        bodyy+=chunk;
       });

    req.on("end", () => {

    const updates = JSON.parse(bodyy);

    if (updates.name) user_id.name = updates.name;
    if (updates.email) user_id.email = updates.email;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User updated successfully" }));
   });
  }
  //Question 3
  else if (method === "DELETE" && url.startsWith("/user/")) {
      const id = url.split("/")[2];
      const userIndex = user.findIndex(user => user.id === parseInt(id));
      if (userIndex === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
        return;
      } 
      const user_index=user.findIndex(user => user.id===parseInt(id));
      const deletedUser = user.splice(user_index, 1);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User deleted successfully" }));
  }
  //Question 4
  else if (method === "GET" && url === "/user") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  }
  //Question 5 
  else if (method === "GET" && url.startsWith("/user/")) {
      const id = url.split("/")[2];
      const user_id=user.find(user => user.id===parseInt(id));
      if (user_id) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user_id));
      } 
      else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
      }
  }
});

server.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});