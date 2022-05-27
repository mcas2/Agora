"use strict";

var validator = require("validator");
var Topic = require("../models/topic");

var controller = {
	test: function (req, res) {
		return res.status(200).send({
			message: "Hola",
		});
	},

	save: function (req, res) {
		var params = req.body;

		try {
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
			var validate_lang = !validator.isEmpty(params.lang);
		} catch (err) {
			return res.status(200).send({
				message: "Faltan datos para enviar ",
			});
		}

		if (validate_content && validate_title && validate_lang) {
			var topic = new Topic();

			topic.title = params.title;
			topic.content = params.content;
			topic.code = params.code;
			topic.lang = params.lang;
			topic.user = req.user.sub;

			topic.save((err, topicStored) => {
				if (err || !topicStored) {
					return res.status(404).send({
						message: "El tema no se ha guardado",
					});
				}

				return res.status(200).send({
					status: "success",
					topic: topicStored,
				});
			});
		} else {
			return res.status(200).send({
				message: "Los datos no son válidos",
			});
		}
	},

	getTopics: function (req, res) {
		if (
			req.params.page == null ||
			req.params.page == undefined ||
			req.params.page == "0" ||
			!req.params.page
		) {
			var page = 1;
		} else {
			var page = parseInt(req.params.page);
		}

		var options = {
			sort: { date: -1 },
			populate: 'user',
			limit: 5,
			page: page
		};

		Topic.paginate({}, options, (err, topics) => {

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta'
				});
			}

			if (!topics){
				return res.status(404).send({
					status: 'error',
					message: 'No hay topics'
				});
			}

			return res.status(200).send({
				status: 'success',
				topics: topics.docs,
				totalDocs: topics.totalDocs,
				totalPages: topics. totalPages
			});
		});
	},

	getTopicsByUser: function (req, res) {

		var userId = req.params.user;

		Topic.find({
			user: userId
		})
		.sort([['date', 'descending']])
		.exec((err, topics) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error en la petición'
				});
			}

			if (!topics){
				return res.status(404).send({
					status: 'error',
					message: 'No hay temas para mostrar'
				});
			}

			return res.status(200).send({
				status: 'success',
				topics
			});
		});
	},

	getTopic: function(req, res){
		var topicId = req.params.id;

		Topic.findById(topicId)
			.populate('user')
			.exec((err, topic) => {
				if(err){
					return res.status(500).send({
						status: 'error',
						message: 'Error en la petición'
					});
				}
	
				if (!topic){
					return res.status(404).send({
						status: 'error',
						message: 'No hay temas para mostrar'
					});
				}

				return res.status(200).send({
					message: 'Soy el getTopic',
					topic
				});
			});
	},

	update: function(req, res){
		var topicId = req.params.id;

		var params = req.body;

		try {
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
			var validate_lang = !validator.isEmpty(params.lang);
		} catch (err) {
			return res.status(200).send({
				message: "Faltan datos por enviar ",
			});
		}

		if (validate_title && validate_content && validate_lang) {
			var update = {
				title: params.title,
				content: params.content,
				code: params.code,
				lang: params.lang
			}

			Topic.findOneAndUpdate({_id: topicId, user:req.user.sub}, update, {new:true},(err, topicUpdated) => {
				if(err){
					return res.status(500).send({
						status: 'Error',
						message: 'Error en la petición'
					});
				}

				if(!topicUpdated){
					return res.status(404).send({
						status: 'Error',
						message: 'No se ha actualizado el tema'
					});
				}
				
				
				return res.status(200).send({
						status: 'success',
						topic: topicUpdated
					});
				}
			);
 

		} else {
			return res.status(200).send({
				message: 'La validación de datos no es correcta.',
			});
		}
	},

	delete: function(req, res){
		var topicId = req.params.id;

		Topic.findOneAndDelete({_id: topicId, user: req.user.sub}, (err, topicRemoved) => {
			if(err){
				return res.status(500).send({
					status: 'Error',
					message: 'Error en la petición'
				});
			}

			if(!topicRemoved){
				return res.status(404).send({
					status: 'Error',
					message: 'No se ha borrado el tema'
				});
			}

			return res.status(200).send({
				status: 'success',
				topic: topicRemoved
			});
		});
	},

	search: function(req, res) {

		var searchString = req.params.search;

		Topic.find({ "$or": [
			{"title": {"$regex": searchString, "$options": "i"}},
			{"content": {"$regex": searchString, "$options": "i"}},
			{"code": {"$regex": searchString, "$options": "i"}},
			{"lang": {"$regex": searchString, "$options": "i"}}
		]})
		.sort([['date', 'descending']])
		.exec((err, topics) => {
			if(err){
				return res.status(500).send({
					status: 'Error',
					message: 'Error en la petición'
				});
			}
			
			if(!topics){
				return res.status(404).send({
					status: 'Error',
					message: 'No existen temas que coincidan con tu búsqueda.'
				});
			}

			return res.status(200).send({
				status: 'success',
				topics
			});
		});
	}
};

module.exports = controller;
