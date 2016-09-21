var ResourceLoader = function (a_total) {
	this.asset_total = a_total;
	this.asset_count = 0;
	this._images = {};
	this.dbData = [];
	this.done = false;
};

ResourceLoader.prototype.load_image = function (name, path, params) {
    var image = new Image();
    var that = this;
    image.onload = function() { 
        that._images[name] = {img : image, par : params};
        ++that.asset_count;
    }
    image.src = path;
};

ResourceLoader.prototype.do_ajax = function (address, identifier, callback) {
    $(document).ready(function() {
        $.ajax({
        	method : "POST",
        	url: address,
        	crossDomain : true,  // Does not make any difference
        	success : callback,
        	data : identifier
        });
    });
};

var helper = { length : 0 };
ResourceLoader.prototype.save_data = function (data, status) {
	// The this context is set to the ajax 
	helper[this.data] = data;
	++helper["length"];
};

ResourceLoader.prototype.get_db_data = function (identifier) {
	if(! this.dbData[identifier]) {
		throw "Could not find " + identifier + " in ResourceLoader.dbData." ;
	}

	var data = this.dbData[identifier];
	return data;
};

ResourceLoader.prototype.is_done = function () {
	return this.done;
};

ResourceLoader.prototype.check_is_done = function (callback) {
	if(this.asset_total == (this.asset_count + helper.length) ) {
		this.dbData = helper;
		helper = null;

		this.done = true;
		callback();
	}
	else{
		var that = this;
		setTimeout(function() {
			that.check_is_done(callback);	
		}, 100);
	}
};

