var Mountain = function (h, d, nrows, ncolumns) {
	this.vNormal_f = [];
    this.vNormal_s = [];
	this.vPosition = [];
	
    this.normalsLines_f = [];
    this.normalsLines_s = [];

	this.n_vertices = 0;
	
	this.H = h;
	this.origD = d;
	this.nRows = nrows;
	this.nColumns = ncolumns;
	this.iter = 0;

	this.quad_queue = [];

	this.data = [];
	for( var i = 0; i < this.nRows; ++i ) {
    	this.data.push( [] );
    	var x = i/(this.nRows-1.0) - 0.5;
    
    	for( var j = 0; j < this.nColumns; ++j ) {
        	var y = j/(this.nColumns-1.0) - 0.5;
        	this.data[i][j] = vec3(x, 0.0, y);
    	}
	}

    this.interval_var;
};

Mountain.prototype.set_update_interval = function (mseconds) {
    var that = this;
    this.interval_var = window.setInterval (function() {
        that.update_data();
    }, mseconds);
};

Mountain.prototype.stop_update_interval = function () {
    window.clearInterval (this.interval_var);
};

Mountain.prototype.update_data = function () {    
    this.vPosition = [];
    this.vNormal_f = [];
    this.vNormal_s = [];

    this.normalsLines_f = [];
    this.normalsLines_s = [];
    
    var quad_node = this.quad_queue.shift();

    this.build_iteration(quad_node[0], quad_node[1],
    					 quad_node[2], quad_node[3],
    					 quad_node[4]);

    // vertex array of nRows*nColumns quadrilaterals 
    // (two triangles/quad) from data

    for(var i = 0; i<(this.nRows-1); i++) {
        for(var j = 0; j<(this.nColumns-1); j++) {
            
            var p1 = this.data[i][j];
            this.vPosition.push( vec4(p1[0], p1[1], p1[2], 1.0));
            
            var p4 = this.data[i][j+1];
            this.vPosition.push( vec4(p4[0], p4[1], p4[2], 1.0));

            var p3 = this.data[i+1][j+1]
            this.vPosition.push( vec4(p3[0], p3[1], p3[2], 1.0));

            var p2 = this.data[i+1][j];
            this.vPosition.push( vec4(p2[0], p2[1], p2[2], 1.0));
            
            // Calculate this quads's normal
            var n = cross(subtract(p3, p1), subtract(p2, p1));
            n = scalev(1.0/length(n), n);

            this.vNormal_f.push(vec4(n));
            this.vNormal_f.push(vec4(n));
            this.vNormal_f.push(vec4(n));
            this.vNormal_f.push(vec4(n));
            
			this.flat_normals(p1, p2, p3, p4, n);

            this.n_vertices += 4;
        }
    }

    this.smooth_normals ();

    if (this.quad_queue.length === 0) {
            this.stop_update_interval ();
    }

    WGL.render (WGL.scene_render);
};

Mountain.prototype.build_iteration = function (a, b, c, d, iter) {

    var max_iter = Math.round(Math.log(this.nRows-1) * Math.LOG2E);
    
    var e = vec2(a[0] , (a[1]+b[1])/2.0);
    var f = vec2((b[0]+c[0])/2.0 , b[1]);
    var g = vec2(c[0] , (c[1]+d[1])/2.0);
    var h = vec2((d[0]+a[0])/2.0 , d[1]);
    var x = vec2((b[0]+c[0])/2.0 , (c[1]+d[1])/2.0);

    this.data[ e[0] ][ e[1] ] = this.middlePointDivision(a, b, iter); //e
    this.data[ f[0] ][ f[1] ] = this.middlePointDivision(b, c, iter); //f
    this.data[ g[0] ][ g[1] ] = this.middlePointDivision(c, d, iter); //g
    this.data[ h[0] ][ h[1] ] = this.middlePointDivision(d, a, iter); //h
    this.data[ f[0] ][ g[1] ] = this.centerHeight(e, f, g, h, iter); //x

    if (iter+1 < max_iter) {
        this.quad_queue.push([a, e, x, h, iter+1]);
        this.quad_queue.push([e, b, f, x, iter+1]);
        this.quad_queue.push([h, x, g, d, iter+1]);
        this.quad_queue.push([x, f, c, g, iter+1]);    
    }
    
};

Mountain.prototype.flat_normals = function (p1,p2,p3,p4,n) {
    // Normal line to be drawn (A->B)
    var addV = add(add(p1, p2), add(p3, p4));
    var A = scalev(0.25, addV);
    var B = add(A, scalev(0.05, n));
    
    this.normalsLines_f.push(vec4(A[0], A[1], A[2], 1.0));
    this.normalsLines_f.push(vec4(B[0], B[1], B[2], 1.0));
};

Mountain.prototype.smooth_normals = function () {
    
    this.normalsLines_s = [];

    var quads_per_line = this.nColumns-1;

    var eachVertexNormal = [];
    for(var i = 0; i < this.nRows; ++i) {
        for(var j = 0; j < this.nColumns; ++j){
            
            var n = vec3(0.0, 0.0, 0.0);
            
            var index11 = quads_per_line*i + j;
            var index10 = index11 - 1;//1;
            var index01 = index11 - quads_per_line;//4;
            var index00 = index11 - quads_per_line-1;//5;

            if(i == 0 && j == 0) {
                n = this.vNormal_f[index11*4];
            }
            else if(i == 0 && j == this.nColumns-1) {
                n = this.vNormal_f[index10*4];
            }
            else if(i==this.nRows-1 && j == 0) {
                n = this.vNormal_f[index01*4];
            }
            else if(i == this.nRows-1 && j == this.nColumns-1) {
                n = this.vNormal_f[index00*4];
            }
            else if(i == 0) {
                n = add(this.vNormal_f[index10*4], this.vNormal_f[index11*4]);
            }
            else if(i == this.nRows-1) {
                n = add(this.vNormal_f[index00*4], this.vNormal_f[index01*4]);
            }
            else if(j == 0) {
                n = add(this.vNormal_f[index01*4], this.vNormal_f[index11*4]);
            }
            else if(j == this.nColumns-1) {
                n = add(this.vNormal_f[index10*4], this.vNormal_f[index00*4]);
            }
            else {
                n = add(add(this.vNormal_f[index00*4], this.vNormal_f[index01*4]),
                        add(this.vNormal_f[index10*4], this.vNormal_f[index11*4]));

            }

            n = scalev(1.0/length(n), n); 
            // Vertex normal that goes as an attribute to the GPU
            eachVertexNormal.push(n);

            // Normal line to be drawn
            var A = this.data[i][j];
            var B = add(A, scalev(0.05, vec3(n[0],n[1],n[2])));

            this.normalsLines_s.push(vec4(A[0], A[1], A[2], 1.0));
            this.normalsLines_s.push(vec4(B[0], B[1], B[2], 1.0));
        }
    }

    this.vNormal_s = [];

    for(var i = 0; i < this.nRows-1; ++i) {
        for(var j = 0 ; j < this.nColumns-1; ++j) {
            var id = i*this.nColumns + j;
            this.vNormal_s.push(eachVertexNormal[id]);
            this.vNormal_s.push(eachVertexNormal[id + 1]);
            this.vNormal_s.push(eachVertexNormal[id + this.nColumns + 1]);
            this.vNormal_s.push(eachVertexNormal[id + this.nColumns]);
        }
    }
    eachVertexNormal = [];
};

Mountain.prototype.middlePointDivision = function (p1, p2, iter) {
    var p1Vec = this.data[p1[0]][p1[1]];
    var p2Vec = this.data[p2[0]][p2[1]];
    var normal = vec3(0.0, 1.0, 0.0);
    // z are the same
    if(p1Vec[2] - p2Vec[2] == 0) {
        normal = vec3(-1.0 * ((p1Vec[1] - p2Vec[1]) / (p1Vec[0] - p2Vec[0])), 1.0, 0.0);
    }
    // x are the same
    else if(p1Vec[0] - p2Vec[0] == 0) {
        normal = vec3(0.0, 1.0, -1.0 * (p1Vec[1] - p2Vec[1]) / (p1Vec[2] - p2Vec[2]));
    }

    normal = normalize(normal);

    return add(scalev(this.rnd(iter), normal), scalev(0.5, add(p1Vec, p2Vec)));
};

Mountain.prototype.centerHeight = function (e, f, g, h, iter) {
    var eVec = this.data[e[0]][e[1]];
    var fVec = this.data[f[0]][f[1]];
    var gVec = this.data[g[0]][g[1]];
    var hVec = this.data[h[0]][h[1]];
    return add(scalev(this.rnd(iter) , vec3(0.0, 1.0, 0.0)) , scalev(0.25, add(add(eVec, fVec), add(gVec, hVec))));
};

Mountain.prototype.rnd = function (iter) {
    return Math.pow(0.5, iter * this.H / 2.0) * this.origD *
        (((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3);
};