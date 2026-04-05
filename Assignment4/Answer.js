const exp=require('express');
const app=exp();
const port=8000;
const fs = require('fs');
const path = require('path');

app.use(exp.json());

//Question 1:
app.post('/user', (req, res) => {
    const { name, email, age } = req.body;
    fs.readFile("users.json", 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Error reading users file'
            });
        }

        let users;

        try {
            users = JSON.parse(data);
        } catch (error) {
            users = [];
        }

        // Check if email already exists
        const existingUser = users.find(user => user.email === email);
         if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            age
        };

        // Add to users
        users.push(newUser);

        // Write updated users back to file
        fs.writeFile("users.json", JSON.stringify(users, null, 2), err => {
            if (err) {
                return res.status(500).json({
                   message: 'Error saving user'
                });
            }

            res.status(201).json({
                message: 'User added successfully',
                user: newUser
            });
        });
    });
});


    // Question 2:
   app.put('/user/:id', (req, res) => {
    const userId = Number(req.params.id);
    const { name, email, age } = req.body;

    fs.readFile("users.json", 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Error reading users file'
            });
        }

        let users;

        try {
            users = JSON.parse(data);
        } catch (error) {
            return res.status(500).json({
                message: 'Invalid users data'
            });
        }

        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // If email is being changed, make sure it does not already exist
        if (email) {
            const emailExists = users.find(
                user => user.email === email && user.id !== userId
            );

            if (emailExists) {
                return res.status(400).json({
                    message: 'Email already exists'
                });
            }
        }

        // Update only provided fields
        if (name) users[userIndex].name = name;
        if (email) users[userIndex].email = email;
        if (age) users[userIndex].age = age;
         fs.writeFile("users.json", JSON.stringify(users, null, 2), err => {
            if (err) {
                return res.status(500).json({
                    message: 'Error updating user'
                });
            }

            res.status(200).json({
                message: 'User updated successfully',
                user: users[userIndex]
            });
        });
    });
});


   // Question 3:

app.delete('/user/:id', (req, res) => {
    // Get ID either from params or body
    const userId = Number(req.params.id || req.body.id);

    if (!userId) {
        return res.status(400).json({
            message: 'User ID is required'
        });
    }

    fs.readFile("users.json", 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Error reading users file'
            });
        }

        let users;

        try {
            users = JSON.parse(data);
        } catch (error) {
            return res.status(500).json({
                message: 'Invalid users data'
            });
        }

        const userExists = users.find(user => user.id === userId);

        if (!userExists) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const updatedUsers = users.filter(user => user.id !== userId);

        fs.writeFile("users.json", JSON.stringify(updatedUsers, null, 2), err => {
            if (err) {
                return res.status(500).json({
                    message: 'Error deleting user'
                     });
            }

            res.status(200).json({
                message: 'User deleted successfully'
            });
        });
    });
});
    
// Question 4:

app.get('/user/getByName', (req, res) => {
    const name = req.query.name;

    if (!name) {
        return res.status(400).json({
            message: 'Name query parameter is required'
        });
    }

    fs.readFile("users.json", 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Error reading users file'
            });
        }

        let users;

        try {
            users = JSON.parse(data);
        } catch (error) {
            return res.status(500).json({
                message: 'Invalid users data'
            });
        }
         const foundUser = users.find(
            user => user.name.toLowerCase() === name.toLowerCase()
        );

        if (!foundUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(foundUser);
    });
});


// Question 5:
app.get('/user', (req, res) => {
    fs.readFile("users.json", 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Error reading users file'
            });
        }

        let users;

        try {
            users = JSON.parse(data);
        } catch (error) {
            return res.status(500).json({
                message: 'Invalid users data'
            });
        }

        res.status(200).json(users);
    });
});

//Question 6:
app.get('/user/filter', (req, res) => {
    const minAge = Number(req.query.minAge);

    if (isNaN(minAge)) {
        return res.status(400).json({
            message: 'minAge query parameter is required and must be a number'
        });
    }

    fs.readFile("users.json", 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Error reading users file'
            });
        }

        let users;
        try {
            users = JSON.parse(data);
        } catch (error) {
            return res.status(500).json({
                message: 'Invalid users data'
            });
        }

        const filteredUsers = users.filter(user => Number(user.age) >= minAge);

        res.status(200).json(filteredUsers);
    });
});


//Question 7:
app.get('/user/:id', (req, res) => {
    const userId = Number(req.params.id);

    fs.readFile("users.json", 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Error reading users file'
            });
        }

        let users;

        try {
            users = JSON.parse(data);
        } catch (error) {
            return res.status(500).json({
                message: 'Invalid users data'
            });
        }

        const foundUser = users.find(user => user.id === userId);

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found'
            });
        }

        res.status(200).json(foundUser);
    });
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});


