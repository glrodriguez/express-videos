import User from "../schemas/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import config from "../src/config.js";


export const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    
    if (!user) {
      return res.status(500).json({ message: "Debes registrarte primero" });
    };

    console.log(user);

    const isValid = bcrypt.compareSync(req.body.password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ 
        id: user._id,
        username: user.username
      },
      config.jwt_key,
      {
        expiresIn: '1h'
      }
    );

    const publicUser = { id: user._id,
      username: user.username,
    };

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60
    }).status(200).json({ message: "Usuario ingresado correctamente", user: publicUser });
  } catch (error) {
    console.error('Error login user:', error);
    res.status(500).json({ error: 'Error login user' });
  }
};

//todo
export const logout = async (req, res) => {
  res.clearCookie('access_token').json({ message: "Sesion cerrada" });
};

export const register = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (user) {
      return res.status(409).json({ error: "El usuario ya existe" });  
    }

    const { username, password } = req.body;

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User created correctly', newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const getHome = async (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');   // Podria validar primero si esta autorizado
};

// Get all users list
export const getUsers = async (req, res) => {
  try {
    console.log(req.user);
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users: ', error);
    res.status(500).json({ error: 'Error getting users' });
  }
};

// Get user data by id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user data: ', error);
    res.status(500).json({ error: 'Error getting user data' });
  }
};

// Update user by id
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated correctly', user });
  } catch (error) {
    console.error('Error updating user: ', error);
    res.status(500).json({ error: 'Error updating user' });
  }
}

// Delete user (soft) by id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true
      },
      {
        new: true
      }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted correctly', user });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};
