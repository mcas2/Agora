"use strict";

var validator = require("validator");
var User = require("../models/user");
var bcrypt = require("bcryptjs");
var jwt = require("../services/jwt");

var controller = {
	probando: function (req, res) {
		return res.status(200).send({
			message: "Soy el método probando",
		});
	},

	testeando: function (req, res) {
		return res.status(200).send({
			message: "Soy el método testeando",
		});
	},

	save: function (req, res) {
		//Recoger los parámetros de la petición
		var params = req.body;
		// Validar los datos

		try {
			var validate_name = !validator.isEmpty(params.name);
			var validate_surname = !validator.isEmpty(params.surname);
			var validate_email =
				!validator.isEmpty(params.email) &&
				validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);
		} catch (err) {
			return res.status(200).send({
				message: "Faltan datos por enviar.",
			});
		}

		if (
			validate_name &&
			validate_surname &&
			validate_email &&
			validate_password
		) {
			// Crear el objeto de usuario
			var user = new User();

			//Asignar valores al usuario
			user.name = params.name;
			user.surname = params.surname;
			user.email = params.email.toLowerCase();
			user.rol = "ROLE_USER";
			user.image = null;

			//Comprobar si el usuario ya existe
			User.findOne({ email: user.email }, (err, issetUser) => {
				if (err) {
					return res.status(500).send({
						message: "Error al comprobar duplicados.",
					});
				}

				if (!issetUser) {
					bcrypt.genSalt(10, function (err, salt) {
						bcrypt.hash(
							params.password,
							salt,
							function (err, hash) {
								user.password = hash;

								user.save((err, userStored) => {
									if (err) {
										return res.status(500).send({
											message:
												"Error al guardar el usuario.",
										});
									}

									if (!userStored) {
										return res.status(500).send({
											message:
												"El usuario no se ha guardado.",
										});
									}

									return res.status(200).send({
										status: "success",
										user: userStored,
									});
								});
							}
						);
					});
				} else {
					return res.status(500).send({
						message: "El usuario ya está registrado.",
					});
				}
			});
		} else {
			return res.status(500).send({
				message: "Validación incorrecta.",
			});
		}
	},

	login: function (req, res) {
		//recoger los parámetros
		var params = req.body;

		//validar los datos
		try {
			var validate_email =
				!validator.isEmpty(params.email) &&
				validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);
		} catch (err) {
			return res.status(404).send({
				message: "Faltan datos por enviar.",
			});
		}

		if (!validate_email || !validate_password) {
			return res.status(200).send({
				message: "Los datos son incorrectos. Revíselos, por favor.",
			});
		}

		User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
			if (err) {
				return res.status(500).send({
					message: "Error en la identificación.",
					user,
				});
			}

			if (!user) {
				return res.status(404).send({
					message: "El usuario no existe",
					user,
				});
			}

			bcrypt.compare(params.password, user.password, (err, check) => {
				if (check) {
					if (params.gettoken) {
						return res.status(200).send({
							token: jwt.createToken(user),
						});
					} else {
						user.password = undefined;

						return res.status(200).send({
							status: "success",
							user,
						});
					}
				} else {
					return res.status(404).send({
						message: "Las credenciales no son correctas.",
						user,
					});
				}
			});
		});
	},

	update: function (req, res) {
        var params = req.body;

        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        } catch (err) {
            return res.status(200).send({
                message: "faltan datos por enviar.",
                params
            });
        }


        delete params.password;

        var userId = req.user.sub;

        if (req.user.email != params.email) {
            User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
                if (err) {
                    return res.status(500).send({
                        message: "Error en la identificación.",
                        user
                    });
                }

                if (user && user.email == params.email) {
                    return res.status(200).send({
                        message: "El email no puede ser modificado",
                    });
                }
            });
        } else {

            User.findOneAndUpdate({ id: userId }, params, { new: true }, (err, userUpdated) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'error al actualizar el usuario'
                    });
                }

                if (!userUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'error al actualizar el usuario'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            });
        }
    },

	uploadAvatar: function(req, res){
		

		return res.status(200).send({
			status: 'success',
			message: 'Upload AVATAR'
		})
	}
};

module.exports = controller;
