'use stric'

var Topic = require('../models/topic');
var validator = require('validator');

var controller = {
    add: function (req, res) {

        //Recoger el id del topic
        var topicId = req.params.topicId;

        //Find por id
        Topic.findById(topicId).exec((err, topic) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }
            if (!topic) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el topic'
                });
            }

            //Comprobar si el usuario esta identificado y validar datos
            if (req.body.content) {
                try {
                    var validate_content = !validator.isEmpty(req.body.content);
                } catch (err) {
                    return res.status(200).send({
                        message: 'No has comentado nada'
                    });
                }
                if (validate_content) {
                    var comment = {
                        user: req.user.sub,
                        content: req.body.content
                    };
                    //En la propiedad comments del objeto resultante hacer un push
                    topic.comments.push(comment);

                    //Guardar el topic completo
                    topic.save((err) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error al guardar el comentario'
                            });
                        }

                        Topic.findById(topic._id)
                            .populate('user')
                            .populate('comments.user')
                            .exec((err, topic) => {
                                if (err) {
                                    return res.status(500).send({
                                        status: 'error',
                                        message: 'error en la peticion'
                                    });
                                }
                                if (!topic) {
                                    return res.status(404).send({
                                        status: 'error',
                                        message: 'No existe el topic'
                                    });
                                }
                                //Devolver el resultado
                                return res.status(200).send({
                                    status: 'success',
                                    topic
                                });
                            });
                    });
                } else {
                    return res.status(200).send({
                        message: 'No se han validado los datos del comentario'
                    });
                }
            }
        });
    },
    update: function (req, res) {

        //Conseguir el id del comentario
        var commentId = req.params.commentId;

        //Recoger datos y validar
        var params = req.body;

        try {
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                message: 'No has comentado nada'
            });
        }

        if (validate_content) {
            //Find and update de un subdocumento
            Topic.findOneAndUpdate({ "comments._id": commentId }, {
                "$set": {
                    "comments.$.content": params.content
                }
            }, { new: true }, (err, topicUpdated) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición'
                    });
                }
                if (!topicUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el topic'
                    });
                }

                //Devolver los datos
                return res.status(200).send({
                    status: 'success',
                    topic: topicUpdated
                });
            });


        }
    },
    delete: function (req, res) {

        //Recoger el id del topic y del comentario
        var topicId = req.params.topicId;
        var commentId = req.params.commentId;

        //Buscar el topic
        Topic.findById(topicId, (err, topic) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }
            if (!topic) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el topic'
                });
            }
            //Seleccionar el subdocumento(comentario)
            var comment = topic.comments.id(commentId);

            //Borrar el comentario
            if (comment) {
                comment.remove();

                //Guardar el topic
                topic.save((err) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la petición'
                        });
                    }
                    Topic.findById(topic._id)
                    .populate('user')
                    .populate('comments.user')
                    .exec((err, topic) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'error en la peticion'
                            });
                        }
                        if (!topic) {
                            return res.status(404).send({
                                status: 'error',
                                message: 'No existe el topic'
                            });
                        }
                        //Devolver el resultado
                        return res.status(200).send({
                            status: 'success',
                            topic
                        });
                    });
                })
            } else {
                //Devolver resultado
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el comentario'
                });
            }

        });
    }
};

module.exports = controller;