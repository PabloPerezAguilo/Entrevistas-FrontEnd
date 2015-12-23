function ServicioREST($http, $q, $rootScope, config) {
	
	var url = config.url;
	
	/* ---------- GESTION DE ERRORES DE SERVICIOS ---------- */
	function tratarError(data, status, defered) {
		if (data === null || status === 404 || status === 0) {
			defered.reject("Servicio no disponible");
		} else if (data === undefined || data.message === undefined || status === 403) {
			//defered.reject("Error: " + status);
			defered.reject(status);
		} else if (status === 405) {
			var error = {
				data: data,
				status: status
			}; 
			defered.reject(error);
		} else {
			defered.reject(data.message);
		}
	}

	/* ---------- SERVICIOS ENTIDAD ---------- */
	function postPregunta(objetoAEnviar) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'POST',
			url: url + '/question',
			data: objetoAEnviar
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}

	function getPreguntas() {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'GET',
			url: url + '/question/'
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}
    
    function deletePregunta(idPregunta) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'DELETE',
			url: url + '/question/'+idPregunta
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}

	function getEntidad(parametroA, parametroB, parametroC) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'GET',
			url: url + '/resource/' + parametroA + "?desde=" + parametroB + "&hasta=" + parametroC
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}



	/* ---------- POST AUTHENTICATE ------------- */

	function postAuthenticate(user) {

		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'POST',
			url: url + '/authenticate',
			data: user
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;

	}
    
    /* ------------- GET INTERVIEW ----------------- */
    
    function getInterview(dni) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'GET',
			url: url + '/interview/' + dni
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}  
    
    function postInterview(entrevista) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'POST',
			url: url + '/interview/',
            data: entrevista
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}
	
	/* --------------- GET TEMAS --------------- */
	
	function getTemas() {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'GET',
			url: url + '/tag/'
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}
	
	/* ------------- GET PREGUNTAS BY TAG ------------- */
	
	function postPreguntasByTag(tag) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'POST',
			url: url + '/questionByTags/',
			data: tag
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}
	
	function postTema(tema) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'POST',
			url: url + '/tag/',
			data: { tag: tema }
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}
	
	return {
		getPreguntas: getPreguntas,
		getEntidad: getEntidad,
		postPregunta: postPregunta,
        deletePregunta: deletePregunta,
		postAuthenticate: postAuthenticate,
        getInterview: getInterview,
        postInterview: postInterview,
		getTemas: getTemas,
		postTema: postTema,
		postPreguntasByTag: postPreguntasByTag
	}
}