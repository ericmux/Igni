var RENFragPhong = function (vs, fs) {
	//  The generic program used to render
	this.program = initShaders (WGL.gl, vs, fs);
	//  VBO for both vertices and texture coordinates
	this.vVBO = WGL.gl.createBuffer ();
    this.nVBO = WGL.gl.createBuffer ();
    
    this.n_vertex;
    this.render_type;
    this.vertex_step;

    this.lightPosition;
    this.ambientProduct;
    this.diffuseProduct;
    this.specularProduct;
    this.shininess;
};

RENFragPhong.prototype.load_vbo = function (vertices, normals, r_type, vert_step,
                                            lp, ap, dp, sp, shin) {
    // Load the data into the VBOs
    WGL.gl.bindBuffer(WGL.gl.ARRAY_BUFFER, this.vVBO);
    WGL.gl.bufferData(WGL.gl.ARRAY_BUFFER, flatten(vertices), WGL.gl.STATIC_DRAW);

    WGL.gl.bindBuffer(WGL.gl.ARRAY_BUFFER, this.nVBO);
    WGL.gl.bufferData(WGL.gl.ARRAY_BUFFER, flatten(normals), WGL.gl.STATIC_DRAW);
   
    this.n_vertex = vertices.length;
    this.render_type = r_type;
    this.vertex_step = vert_step;

    this.lightPosition = lp;
    this.ambientProduct = ap;
    this.diffuseProduct = dp;
    this.specularProduct = sp;
    this.shininess = shin;
};

RENFragPhong.prototype.draw = function (p, mv) {
	WGL.gl.useProgram(this.program);

	WGL.gl.uniformMatrix4fv( WGL.gl.getUniformLocation(this.program, "projectionMatrix"),false, flatten(p));
	WGL.gl.uniformMatrix4fv( WGL.gl.getUniformLocation(this.program, "modelViewMatrix"),false, flatten(mv));
    
    WGL.gl.uniform4fv( WGL.gl.getUniformLocation(this.program, "lightPosition"), flatten(this.lightPosition));
    WGL.gl.uniform4fv( WGL.gl.getUniformLocation(this.program, "ambientProduct"), flatten(this.ambientProduct));
    WGL.gl.uniform4fv( WGL.gl.getUniformLocation(this.program, "diffuseProduct"), flatten(this.diffuseProduct));
    WGL.gl.uniform4fv( WGL.gl.getUniformLocation(this.program, "specularProduct"), flatten(this.specularProduct));
    
    WGL.gl.uniform1f( WGL.gl.getUniformLocation(this.program, "shininess"), this.shininess);

    // Associate out shader variables with our data buffer
    var vPosition = WGL.gl.getAttribLocation(this.program, "vPosition");
    WGL.gl.bindBuffer(WGL.gl.ARRAY_BUFFER, this.vVBO);
    WGL.gl.vertexAttribPointer(vPosition, 4, WGL.gl.FLOAT, false, 0, 0);
    WGL.gl.enableVertexAttribArray(vPosition);

    var vNormal = WGL.gl.getAttribLocation(this.program, "vNormal");
    WGL.gl.bindBuffer(WGL.gl.ARRAY_BUFFER, this.nVBO);
    WGL.gl.vertexAttribPointer(vNormal, 4, WGL.gl.FLOAT, false, 0, 0);
    WGL.gl.enableVertexAttribArray(vNormal);

    for (var i = 0; i < this.n_vertex; i+=this.vertex_step) {
        WGL.gl.drawArrays(this.render_type, i, this.vertex_step );
    }
};