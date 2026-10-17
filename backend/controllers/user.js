const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const createToken = (user) => jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET || 'secret_rh_2026',
  { expiresIn: '24h' }
);

exports.signup = (req, res, next) => {
  const { nom, email, password } = req.body;

  if (!nom || !email || !password) {
    return res.status(400).json({ message: 'Nom, email et mot de passe requis.' });
  }

  bcrypt.hash(password, 10)
    .then((hash) => {
      const user = new User({
        nom,
        email,
        password: hash
      });

      return user.save();
    })
    .then((savedUser) => {
      const token = createToken(savedUser);
      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        token,
        user: {
          id: savedUser._id,
          nom: savedUser.nom,
          email: savedUser.email
        }
      });
    })
    .catch((error) => {
      if (error && error.code === 11000) {
        return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
      }
      return res.status(500).json({ error: error.message || error });
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis.' });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Identifiants invalides.' });
      }

      return bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (!isValid) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
          }

          const token = createToken(user);
          return res.status(200).json({
            token,
            user: {
              id: user._id,
              nom: user.nom,
              email: user.email
            }
          });
        });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message || error });
    });
};