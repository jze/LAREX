function GUI(canvas, viewer) {
	var _viewer = viewer;
	var _canvas = canvas;
	var _doMoveCanvas = false;
	var _gui = this;
	var _mouse;

	$(document).mousemove(function( event ) {
	  _mouse = {x:event.pageX,y:event.pageY};
	});

	this.setCanvas = function(id){
		_canvas = id;
	}

	this.updateZoom = function(){
		var zoom = _viewer.getZoom();
		zoom = Math.round(zoom*10000)/100;

		$('.zoomvalue').text(zoom);
	}

	this.moveCanvas = function(doMove){
		if(doMove){
			document.body.style.cursor = "move";
			_doMoveCanvas = true;
		} else {
			document.body.style.cursor = "auto";
			_doMoveCanvas = false;
		}
	}

	this.openContextMenu = function(doSelected,id){
		var $contextmenu = $("#contextmenu");
		$contextmenu.removeClass("hide");
		var fitsInWindow = _mouse.y+$contextmenu.height() < $(window).height();

		if(fitsInWindow){
			$contextmenu.css({top: _mouse.y-5, left: _mouse.x-5});
		}else{
			$contextmenu.css({top: _mouse.y+5-$contextmenu.height(), left: _mouse.x-5});
		}
		$contextmenu.data('doSelected',doSelected);
		$contextmenu.data('polygonID',id);

	}

	this.closeContextMenu = function(){
		$("#contextmenu").addClass("hide");
	}

	this.displaySelected = function(selected){
		var id = "";
		var selectType = "";
		var prevSelectType = "";

		for(var i = 0, selectedsize = selected.length; i < selectedsize; i++ ){
			id += selected[i].id;
			if(i + 1 < selectedsize){
				id += ", ";
			}
			if(prevSelectType === "" || prevSelectType === selected[i].type){
				selectType = selected[i].type;
				prevSelectType = selectType;
			}else{
				selectType = "diverse";
			}
		}

		$(".selectID").text(id);
		$(".selectID").val(id);
		$(".selectType").html(selectType);
		$(".selectType").val(selectType);

		$("#selectTypes").material_select();
		Materialize.updateTextFields();
	}

	this.resizeViewerHeight = function(){
		$canvas = $("#"+_canvas);
		$sidebars = $('.sidebar');
		var height = $(window).height() - $canvas.offset().top;

		$canvas.height(height);
		$sidebars.height(height);
	}

	this.setCanvasUITopRight = function(){
		var positionCanvas = $("#"+_canvas).offset();
		$("#toprightUI").offset({ top: positionCanvas.top, left: positionCanvas.left });
	}

	this.setParameters = function(parameters){
		$("#binarythreash").val(parameters['binarythreash']);
		$("#textdilationX").val(parameters['textdilationX']);
		$("#textdilationY").val(parameters['textdilationY']);
		$("#imagedilationX").val(parameters['imagedilationX']);
		$("#imagedilationY").val(parameters['imagedilationY']);
	}

	this.getParameters = function(){
			var parameters = {};
			parameters['binarythreash'] = $("#binarythreash").val();
			parameters['textdilationX'] = $("#textdilationX").val();
			parameters['textdilationY'] = $("#textdilationY").val();
			parameters['imagedilationX'] = $("#imagedilationX").val();
			parameters['imagedilationY'] = $("#imagedilationY").val();
			return parameters;
	}

	this.setRegionLegendColors = function(segmenttypes){
		// Iterate over Segmenttype-"Map" (Object in JS)
		Object.keys(segmenttypes).forEach(function(key) {
			var color = _viewer.getColor(key);
			$(".legendicon."+key).css("background-color", color.toCSS());
		});
	}

	this.forceUpdateRegionHide = function(visibleRegions){
		var $allSwitchBoxes = $('.regionlegend');
		var _visibleRegions = visibleRegions;
		$allSwitchBoxes.each(function() {
			var $this = $(this);
			var $switchBox = $($this.find('input'));
			var regionType = $this.data('type');

			if(_visibleRegions[regionType]){
				$switchBox.prop('checked',true);
			}else{
				$switchBox.prop('checked',false);
			}
		});
	}
	this.forceUpdateRegionHide = function(visibleRegions){
		var $allSwitchBoxes = $('.regionlegend');
		var _visibleRegions = visibleRegions;
		$allSwitchBoxes.each(function() {
			var $this = $(this);
			var $switchBox = $($this.find('input'));
			var regionType = $this.data('type');

			if(_visibleRegions[regionType]){
				$switchBox.prop('checked',true);
			}else{
				$switchBox.prop('checked',false);
			}
		});
	}
	this.showUsedRegionLegends = function(presentRegions){
		$('.regionlegend').each(function() {
			var legendType = $(this).data('type');

			if($.inArray(legendType, presentRegions) > -1){
				$(this).removeClass('hide');
			}else{
				$(this).addClass('hide');
			}
		});
	}

	this.openRegionSettings = function(regionType,minSize,maxOccurances,priorityPosition,doCreate){
		$('#regionType').text(regionType);
		$('#regionMinSize').val(minSize);
		$('#regionMaxOccurances').val(maxOccurances);
		//TODO color	$('#regionTypeLegendIcon').css("background-color", getColor(regionType).toCSS());
		if(doCreate != null && doCreate == true){
			$('#regionType').addClass('hide');
			$('#regioneditorSelect').removeClass('hide');
			$('.regionSetting').addClass('hide');
			$('#regioneditorSave').addClass('hide');
			$('.regionDelete').addClass('hide');
		}else{
			$('#regionType').removeClass('hide');
			$('#regioneditorSelect').addClass('hide');
			$('.regionSetting').removeClass('hide');
			$('#regioneditorSave').removeClass('hide');
			$('.regionDelete').removeClass('hide');
		}
		//$('#regioneditor').modal('open');
		$settingsOffset = $('#sidebarRegions').offset();
		$regioneditor = $('#regioneditor');
		$regioneditor.removeClass('hide');
		$regioneditor.css({top: $settingsOffset.top, left: $settingsOffset.left-$regioneditor.width()});
	}
	this.closeRegionSettings = function(){
		$('#regioneditor').addClass('hide');
	}

	this.selectToolBarButton = function(option, doSelect){
		var $button = null;
		switch(option){
			case 'regionRectangle':
				$button = $('.createRegionRectangle');
				break;
			case 'regionBorder':
				$button = $('.createRegionBorder');
				break;
			case 'segmentRectangle':
				$button = $('.createSegmentRectangle');
				break;
			case 'segmentPolygon':
				$button = $('.createSegmentPolygon');
				break;
			case 'cut':
				$button = $('.createCut');
				break;
			default:
				break;
		}
		if($button){
			if(doSelect){
				$button.addClass('invert');
			}else{
				$button.removeClass('invert');
			}
		}
	}

	this.unselectAllToolBarButtons = function(){
		var $buttons = $('.menuIcon');
		$buttons.removeClass('invert');
	}

	this.selectPage = function(page){
		$('.pageImageContainer').removeClass('selected');
		$('.pageImageContainer[data-page~="'+page+'"]').addClass('selected');
	}
	this.highlightSegmentedPages = function(segmentedPages){
		$('.pageImageContainer').removeClass('segmented');
		segmentedPages.forEach(function(page) {
			$('.pageImageContainer[data-page~="'+page+'"]').addClass('segmented');
		});
	}
}
