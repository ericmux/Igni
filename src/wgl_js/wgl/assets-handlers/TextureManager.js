var TextureManager = function (a_total) {
	this.textures = {};
	this.asset_total = a_total;
	this.asset_count = 0;
};

/**
*  
*/
TextureManager.prototype.file_texture = function (name, image, params) {
	params = this.process_params(params);

	var texture = WGL.gl.createTexture();
    WGL.gl.bindTexture( WGL.gl.TEXTURE_2D, texture );
	
	WGL.gl.pixelStorei(WGL.gl.UNPACK_FLIP_Y_WEBGL, false);
    WGL.gl.texImage2D( WGL.gl.TEXTURE_2D, 0, params.colorMode,
    	               params.colorMode, params.dataType, image);
    WGL.gl.texParameteri(WGL.gl.TEXTURE_2D, WGL.gl.TEXTURE_WRAP_S, WGL.gl.CLAMP_TO_EDGE);
	WGL.gl.texParameteri(WGL.gl.TEXTURE_2D, WGL.gl.TEXTURE_WRAP_T, WGL.gl.CLAMP_TO_EDGE);
	WGL.gl.texParameteri( WGL.gl.TEXTURE_2D, WGL.gl.TEXTURE_MIN_FILTER, params.minFilter);
    WGL.gl.texParameteri( WGL.gl.TEXTURE_2D, WGL.gl.TEXTURE_MAG_FILTER, params.magFilter);

    ++this.asset_count;
    this.textures[name] = texture;
};

TextureManager.prototype.is_done = function () {
	return this.done;
};

TextureManager.prototype.check_is_done = function (callback) {
	if(this.asset_total == this.asset_count) {
		this.done = true;
		callback();
	}
	else {
		var that = this;
		setTimeout(function() { 
			that.check_is_done(callback);
		}, 100);
	}
};

TextureManager.prototype.process_params = function (params) {
	if(undefined === params || null === params) { params = {}; }
	if(! params['colormode']) { params.colorMode = WGL.gl.RGBA; }
	if(! params['dataType']) { params.dataType = WGL.gl.UNSIGNED_BYTE; }
	if(! params['minFilter']) { params.minFilter = WGL.gl.LINEAR; }
	if(! params['magFilter']) { params.magFilter = WGL.gl.LINEAR; }
	return params;
};