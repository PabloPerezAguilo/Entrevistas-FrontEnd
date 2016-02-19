function ServicioREST($http, $q, $rootScope, config) {
	
	var url = config.url;
	
	/* ---------- GESTION DE ERRORES DE SERVICIOS ---------- */
	function tratarError(data, status, defered) {
		if (data === null || status === 404 || status === 0) {
			defered.reject("Servicio no disponible");
		} else if (data === undefined || data.message === undefined || status === 403) {
			//defered.reject("Error: " + status);
			defered.reject(status);
		} else if (status === 500) {
			var error = {
				data: data,
				status: status
			}; 
			defered.reject(error);
		} else {
			defered.reject(data.message);
		}
	}
	
	function llamadaHTTP(conf){
		var defered = $q.defer();
		var promise = defered.promise;
		$http(conf)
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}

	/* ---------- SERVICIOS ENTIDAD ---------- */
	
	function postPregunta(objetoAEnviar) {
		return llamadaHTTP({
			method: 'POST',
			url: url + '/question',
			data: objetoAEnviar
		});
	}
	
	function getPreguntas() {
		return llamadaHTTP({
			method: 'GET',
			url: url + '/question'
		});
	}
	
    function deletePregunta(idPregunta) {
		return llamadaHTTP({
			method: 'DELETE',
			url: url + '/question/' + idPregunta
		});
	}
	
	/* --------------- GET TEMAS --------------- */
	function getTemas() {
		return llamadaHTTP({
			method: 'GET',
			url: url + '/tag/'
		});
	}
	
	/* ------------- GET PREGUNTAS BY TAG ------------- */
	function postPreguntasByTag(tag) {
		return llamadaHTTP({
			method: 'POST',
			url: url + '/questionByTags/',
			data: tag
		});
	}
	
	function postTema(tema) {
		return llamadaHTTP({
			method: 'POST',
			url: url + '/tag/',
			data: { tag: tema }
		});
	}

	/* ---------- POST AUTHENTICATE ------------- */
	function postAuthenticate(user) {
		return llamadaHTTP({
			method: 'POST',
			url: url + '/authenticate',
			data: user
		});
	}
	
    /* ------------- INTERVIEW -------------- */
	function getEntrevistas(atributos) {
		return llamadaHTTP({
			method: 'GET',
			url: url + '/interview/' + atributos
		});
	}
    
	function postInterview(entrevista) {
		return llamadaHTTP({
			method: 'POST',
			url: url + '/interview/',
            data: entrevista
		});
	}
	
	function getNombresEntrevistas(fecha) {
		return llamadaHTTP({
			method: 'GET',
			url: url + '/interviewNames/' + fecha
		});
	}
	
	function deleteEntrevista(idEntrevista) {
		return llamadaHTTP({
			method: 'DELETE',
			url: url + '/interview/' + idEntrevista
		});
	}
	
	/* ---------- ENTREVISTADO ------------- */
	function getPreguntasEntrevistaById(idEntrevista) {
		return llamadaHTTP({
			method: 'GET',
			url: url + '/interviewQuestions/' + idEntrevista
		});
	}
	
	function postRespuestasEntrevista(idEntrevista, respuestas) {
		return llamadaHTTP({
			method: 'POST',
			url: url + '/answers/' + idEntrevista,
			data: respuestas
		});
	}
	
	function postFeedback(idEntrevista, feedback) {
		return llamadaHTTP({
			method: 'POST',
			url: url + '/interviewFeedback/' + idEntrevista,
			data: feedback
		});
	}
	
	/*---------------USUARIO---------------*/
	function postUsuario(usuario) {
		return llamadaHTTP({
			method: 'POST',
			url: url + '/user',
			data: usuario
		});
	}
	
	function getUsuarios(rol) {
		return llamadaHTTP({
			method: 'GET',
			url: url + '/user?role=' + rol
		});
	}
	
	function getUsuario(rol, nick) {
		return llamadaHTTP({
			method: 'GET',
			url: url + '/user?role=' + rol + "&nick=" + nick
		});
	}
	
	function deleteUsuario(nick) {
		return llamadaHTTP({
			method: 'DELETE',
			url: url + '/user',
			data: {username: nick}
		});
	}
	
	return {
		getPreguntas: getPreguntas,
		postPregunta: postPregunta,
        deletePregunta: deletePregunta,
		postAuthenticate: postAuthenticate,
        getEntrevistas: getEntrevistas,
        postInterview: postInterview,
		getTemas: getTemas,
		postTema: postTema,
		postPreguntasByTag: postPreguntasByTag,
		getNombresEntrevistas: getNombresEntrevistas,
		deleteEntrevista: deleteEntrevista,
		getPreguntasEntrevistaById: getPreguntasEntrevistaById,
		postRespuestasEntrevista: postRespuestasEntrevista,
		postFeedback: postFeedback,
		postUsuario: postUsuario,
		getUsuarios: getUsuarios,
		getUsuario: getUsuario,
		deleteUsuario: deleteUsuario
	}
}