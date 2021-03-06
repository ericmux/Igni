var RENFlatColor = function () {
	//  The generic program used to render
	this.program = initShaders (WGL.gl, "vs-simplesprite", "fs-simplesprite");
	//  VBO for both vertices and texture coordinates
	this.vVBO = WGL.gl.createBuffer ();
    this.uvVBO = WGL.gl.createBuffer ();

    this.n_vertex;
    this.render_type;
    this.vertex_step;
};

RENFlatColor.prototype.load_vbo = function (vertices, texture, uvs, r_type, vert_step) {
    // Load the data into the VBOs
    WGL.gl.bindBuffer(WGL.gl.ARRAY_BUFFER, this.vVBO);
    WGL.gl.bufferData(WGL.gl.ARRAY_BUFFER, flatten(vertices), WGL.gl.STATIC_DRAW);
   
    WGL.gl.bindBuffer(WGL.gl.ARRAY_BUFFER, this.uvVBO);
    WGL.gl.bufferData(WGL.gl.ARRAY_BUFFER, flatten(uvs), WGL.gl.STATIC_DRAW);

    WGL.gl.bindTexture(WGL.gl.TEXTURE_2D, texture);

    this.n_vertex = vertices.length;
    this.render_type = r_type;
    this.vertex_step = vert_step;
};

RENFlatColor.prototype.draw = function (p, mv) {
	WGL.gl.useProgram(this.program);

	WGL.gl.uniformMatrix4fv( WGL.gl.getUniformLocation(this.program, "projectionMatrix"),false, flatten(p));
	WGL.gl.uniformMatrix4fv( WGL.gl.getUniformLocation(this.program, "modelViewMatrix"),false, flatten(mv));

    //WGL.gl.uniform4fv( WGL.gl.getUniformLocation(this.program, "fColor"), flatten(this.render_color));


    // Associate out shader variables with our data buffer
    var vPosition = WGL.gl.getAttribLocation(this.program, "vPosition");
    WGL.gl.bindBuffer(WGL.gl.ARRAY_BUFFER, this.vVBO);
    WGL.gl.vertexAttribPointer(vPosition, 4, WGL.gl.FLOAT, false, 0, 0);
    WGL.gl.enableVertexAttribArray(vPosition);

    var vTexcoord = WGL.gl.getAttribLocation(this.program, "vTexcoord");
    WGL.gl.bindBuffer(WGL.gl.ARRAY_BUFFER, this.uvVBO);
    WGL.gl.vertexAttribPointer(vTexcoord, 2, WGL.gl.FLOAT, false, 0 , 0);
    WGL.gl.enableVertexAttribArray(vTexcoord);

    for (var i = 0; i < this.n_vertex; i+=this.vertex_step) {
        WGL.gl.drawArrays(this.render_type, i, this.vertex_step );
    }
};