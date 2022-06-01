'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

const multer = require('multer');
const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads/users/');
	},
	filename: function(req, file, cb){
		cb(null, "user"+ Date.now() + file.originalname);
	}
});
const upload = multer({storage: storage});

//var multipart = require('connect-multiparty');
//var md_upload = multipart({ uploadDir: './uploads/users' });



//Rutas de prueba
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);

//Rutas de usuarios
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/user/update', md_auth.authenticated, UserController.update);
router.post('/upload-avatar', [md_auth.authenticated, upload.single('file0')], UserController.uploadAvatar);
router.get('/avatar/:fileName', UserController.avatar);
router.get('/users', UserController.getUsers);
router.get('/user/:userId', UserController.getUser);

module.exports = router;