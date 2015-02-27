function attachCustomControl(camera, element, noPreventDefault){
            var _this = camera;
			_this.angularSensibility = 3333.0;
			_this.wheelPrecision = 3.0;
            var previousPosition;
			var down = null;
            var engine = camera.getEngine();

            if (this._attachedElement) {
                return;
            }
            camera._attachedElement = element;

            if (this._onMouseDown === undefined) {
			
				camera._onDblClick = function (evt){
					if(selected==undefined){
						var picked = scene.pick(evt.clientX, evt.clientY);
						if(picked.hit==true){
							selectTile(picked);
						}
					}
				}
				
                camera._onMouseDown = function (evt) {
					down = evt.buttons;
                    previousPosition = {
                        x: evt.clientX,
                        y: evt.clientY
                    };
                };

                camera._onMouseUp = function (evt) {
				    down = null;
                    previousPosition = null;
					if(selected!=undefined){
						animateSelected(selected.rotation, new BABYLON.Vector3(0, 0, 0),selected, selectedRotation);
					}

                };

                camera._onMouseOut = function (evt) {
                    previousPosition = null;
					down = null;
					if(selected!=undefined){
						animateSelected(selected.rotation, new BABYLON.Vector3(0, 0, 0),selected, selectedRotation);
					}
                    _this._keys = [];
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                };

                camera._onMouseMove = function (evt) {
                    if (!previousPosition && !engine.isPointerLock) {
                        return;
                    }

				    var offsetX;
                    var offsetY;

				    if (!engine.isPointerLock) {
                        offsetX = evt.clientX - previousPosition.x;
                        offsetY = evt.clientY - previousPosition.y;
                    } else {
                        offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
                        offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
                    }
			
					if(selected!=undefined){
						if(down==1){
							var zRot = selected.rotation.z;
							var xRot = selected.rotation.x;
							var fortyFive = Math.PI / 4;
							
							if(zRot > fortyFive)
								selected.rotation.z = fortyFive;
							else if(zRot < -fortyFive)
								selected.rotation.z = -fortyFive;
							else
								selected.rotation.z -= offsetX / 2500;
															
							if(xRot > fortyFive)
								selected.rotation.x = fortyFive;
							else if(xRot < -fortyFive)
								selected.rotation.x = -fortyFive;
							else
								selected.rotation.x -= offsetY / 2500;
						}
						return;
					}	
					
					if(down==4){
						_this.cameraRotation.x += offsetX / _this.angularSensibility;
						_this.cameraRotation.y += offsetY / _this.angularSensibility;
					}else if(down==1){
						_this.position.x -= offsetX / 10;
						_this.position.z += offsetY / 10;
					}
					
                    previousPosition = {
                        x: evt.clientX,
                        y: evt.clientY
                    };
					
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                };
				
                camera._wheel = function (event) {//TODO: get to work.
                    var delta = 0;
					console.log(event);
                    if (event.wheelDelta) {
                        delta = event.wheelDelta / (_this.wheelPrecision * 40);
                    } else if (event.detail) {
                        delta = -event.detail / _this.wheelPrecision;
                    }

                    if (delta)
                        camera.position.y += delta;

                    if (event.preventDefault) {
                        if (!noPreventDefault) {
                            event.preventDefault();
                        }
                    }
                };
				
                camera._onKeyDown = function (evt) {
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 || _this.keysDown.indexOf(evt.keyCode) !== -1 || _this.keysLeft.indexOf(evt.keyCode) !== -1 || _this.keysRight.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);

                        if (index === -1) {
                            _this._keys.push(evt.keyCode);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                };

                camera._onKeyUp = function (evt) {
					if(evt.keyCode==27){//ESC
						deselectTile();
					}
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 || _this.keysDown.indexOf(evt.keyCode) !== -1 || _this.keysLeft.indexOf(evt.keyCode) !== -1 || _this.keysRight.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index >= 0) {
                            _this._keys.splice(index, 1);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                };

                camera._onLostFocus = function () {
                    _this._keys = [];
					down = null;
                };

                camera._reset = function () {
                    _this._keys = [];
					down = null;
                    previousPosition = null;
                    _this.cameraDirection = new BABYLON.Vector3(0, 0, 0);
                    _this.cameraRotation = new BABYLON.Vector2(0, 0);
                };
            }

            element.addEventListener("dblclick", camera._onDblClick, false);
            element.addEventListener("mousedown", camera._onMouseDown, false);
            element.addEventListener("mouseup", camera._onMouseUp, false);
            element.addEventListener("mouseout", camera._onMouseOut, false);
            element.addEventListener("mousemove", camera._onMouseMove, false);
			element.onMouseWheel = camera._wheel;//('mousewheel', camera._wheel, false);//WTF!

			//TODO: touch events. hand.js?
            /*element.addEventListener("touchmove", camera._onMouseMove, false);
            element.addEventListener("touchstart", camera._onMouseDown, false);
            element.addEventListener("touchend", camera._onMouseUp, false);
            element.addEventListener("touchcancel", camera._onMouseOut, false);
            element.addEventListener("touchleave", camera._onMouseOut, false);*/

            BABYLON.Tools.RegisterTopRootEvents([
                { name: "keydown", handler: camera._onKeyDown },
                { name: "keyup", handler: camera._onKeyUp },
                { name: "blur", handler: camera._onLostFocus }
            ]);
        };
