function ServicioREST($http, $q, $rootScope, config) {
	
	var url = config.url;
	
	/* ---------- GESTION DE ERRORES DE SERVICIOS ---------- */
	function tratarError(data, status, defered) {
		if (data === null || status === 404 || status === 0) {
			defered.reject("Servicio no disponible");
		} else if (data === undefined || data.message === undefined) {
			//defered.reject("Error: " + status);
			defered.reject(status);
		} else {
			defered.reject(data.message);
		}
	}

	/* ---------- SERVICIOS ENTIDAD ---------- */
	function postEntidad(objetoAEnviar) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'POST',
			url: url + '/entidad',
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

	function getEntidades() {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'GET',
			url: url + '/resource/'
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
    

		
	return {
		getEntidades: getEntidades,
		getEntidad: getEntidad,
		postEntidad: postEntidad,
		postAuthenticate: postAuthenticate,
        getInterview: getInterview
	}
}